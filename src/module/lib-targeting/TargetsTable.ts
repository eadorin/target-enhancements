export const SOURCE_TYPES = {
    SOURCE_TYPE_TOKEN  : 0,
    SOURCE_TYPE_PLAYER : 1,
    SOURCE_TYPE_GM     : 2
};

export const SOCKET_MESSAGE_TYPES = {
    ADD_TARGET : 0,
    DELETE_TARGET : 1,
};

/**
 * Targets Table is responsible for building a simple array of records,
 * storing entities that target other entities
 * It also provides helper methods for querying/updating/modifying the table
 */
export class TargetsTable {
    flagScope = "TargetsTable"
    flagKey = "targets"
    socketScope = "module." + this.flagScope;
    records:ObjectSet;

    /**
     * The constructor initalizes all records to be of type ObjectSet. This is a wrapper
     * class that is required because Set compares two object instances, which is not
     * what we need.
     * @param {String} scope The scope needs to match an existing module
     */
    constructor(scope) {
        this.records = new ObjectSet();
        this.flagScope = scope;

        if(game.scenes.active){
            if ( (typeof game.scenes.active.getFlag(this.flagScope, this.flagKey)) === 'undefined') {
                game.scenes.active.setFlag(this.flagScope, this.flagKey, this.records);
            }
        }

        if (game.isGM) { this.initGMListener();}
    }

    async initGMListener() {
        // TODO MAYBE TO UPGRADE THE CODE
        game.socket['on'](this.socketScope, async data => {
            switch (data.type) {
                case SOCKET_MESSAGE_TYPES.ADD_TARGET :
                  {
                    this.addTargetFromPlayer(data.payload);
                    break;
                  }
                case SOCKET_MESSAGE_TYPES.DELETE_TARGET :
                  {
                    this.removeTargetFromPlayer(data.payload);
                    break;
                  }
                default:
                  {
                    return;
                    break; // unnecessary but here for linting
                  }
            }
        } );
    }

    /**
     *
     * @param {*} source
     * @param {*} target
     */
    async addTarget(source, target) {

        let messageType = SOCKET_MESSAGE_TYPES.ADD_TARGET;
        let t = (target instanceof Token) ? target : this.getTokenByTokenId(target);
        let record = await this.getRecord(source,t)
        await this.records.add(record);

        //------------ If user isn't GM, use websockets to convey the info ------------
        if (!game.user.isGM) {
            // not a GM. Send the record to the GM to add to
            // their table, and then call storeTable();
            this.sendSocketData(record,messageType);
            return;
        }

        this.storeTable();
    }


    /**
     * This should be called from the initGMListener
     * It should only be executed by the GM
     * @param {TokenTarget} record the record to be added
     */
    async addTargetFromPlayer(record) {
        await this.records.add(record);
        this.storeTable();
    }

    async sendSocketData(dataToSend, messageType) {
        // TODO MAYBE TO UPGRADE THE CODE
        let res = await game.socket['emit'](this.socketScope, {
            type: messageType,
            payload : {
                data: dataToSend
            }
        });
        return;
    }

    /**
     *
     * @param {*} source
     * @param {*} target
     */
    async removeTarget(source, target) {
        let messageType = SOCKET_MESSAGE_TYPES.DELETE_TARGET;
        let t = (target instanceof Token) ? target : this.getTokenByTokenId(target);
        let record = await this.getRecord(source,t);
        this.records.delete(record);
        if (!game.user.isGM) {
            this.sendSocketData(record,messageType);
            return;
        }
        this.storeTable();
    }

    /**
     * This should be called from the initGMListener
     * It should only be executed by the GM
     * @param {TokenTarget} record the record to be removed
     */
    async removeTargetFromPlayer(record) {
        await this.records.delete(record);
        this.storeTable();
    }

    /**
     * Get everyone targeting a given source
     * @param {*} target
     */
    async getTargetSources(target) {
        let t = (target instanceof Token) ? target : this.getTokenByTokenId(target);
        let returnValues = [];
        let vals = await this.records.values();
        returnValues.push(vals.filter(obj => { return obj.targetID === target.id }));
        return returnValues;

    }

    /**
     * Get all targets for a given source
     * @param {*} source
     */
    async getSourceTargets(source) {
        let returnValues = [];
        let vals = await this.records.values();
        console.log(vals);
        console.log(source);
        returnValues.push(vals.filter( obj => {return obj.sourceID === source.id}));
        return returnValues;
    }

    /**
     * dump the entire table
     */
    async getAllRecords() {
        return this.records.values();
    }

    /**
     * Get all records
     * @param {*} source
     * @param {*} target
     */
    async getRecord(source, target) {
        let record = {};
        if (source instanceof User) {
            if (source.isGM) {
                // check if GM controls tokens
                // TODO
                record = new TokenTarget(target.id, source.id, SOURCE_TYPES.SOURCE_TYPE_GM);
            } else {
                record = new TokenTarget(target.id, source.id, SOURCE_TYPES.SOURCE_TYPE_PLAYER);
            }
        } else if (source instanceof Token) {
            record = new TokenTarget(target.id, source.id, SOURCE_TYPES.SOURCE_TYPE_TOKEN);
        }

        return record;
    }

    /**
     * Store the records table in a flag; only works if GM/AssistGM
     */
    async storeTable() {

        let scene = game.scenes.active;
        scene.unsetFlag(this.flagScope, this.flagKey);
        return await scene.setFlag(this.flagScope,this.flagKey,this.records);
    }

    /**
     * Helper function to get a token by its ID
     * @param {int} item the id of the token we're looking for
     */
    getTokenByTokenId(item) {
        return canvas.tokens.placeables.find(x => { return x.id === item });
    }
}


/**
 * Generic class to hold our records
 */
class TokenTarget {

    targetID;
    sourceID;
    sourceType;

    constructor(targetID, sourceID, sourceType) {
        this.targetID = targetID;
        this.sourceID = sourceID;
        this.sourceType = sourceType;
    }
    toString() {
        return this.targetID + this.sourceID;
    }
}



// Set of objects.  Requires a .toString() overload to distinguish objects.
// Credit: https://stackoverflow.com/users/177222/ashleysbrain
// taken from https://stackoverflow.com/questions/5657219/set-of-objects-in-javascript
export class ObjectSet {

    items = {};
    item_count = 0;

    constructor() {
        this.items = {};
        this.item_count = 0;
    }

    contains(x) {
        return this.items.hasOwnProperty(x.toString());
    }

    add(x) {
        if (!this.contains(x)) {
            this.items[x.toString()] = x;
            this.item_count++;
        }

        return this;
    }

    delete(x) {
        if (this.contains(x)) {
            delete this.items[x.toString()];
            this.item_count--;
        }

        return this;
    }

    clear() {
        this.items = {};
        this.item_count = 0;

        return this;
    }

    isEmpty() {
        return this.item_count === 0;
    }

    count() {
        return this.item_count;
    }

    values() {
        var i, ret = [];

        for (i in this.items) {
            if (this.items.hasOwnProperty(i))
                ret.push(this.items[i]);
        }

        return ret;
    }
}
