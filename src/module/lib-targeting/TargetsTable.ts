import { ObjectSet } from "./ObjectSet";
import { TokenTarget } from "./TokenTarget";
import { FlagsTargeting, FlagScopeTargeting, socketNameTargeting, SOCKET_MESSAGE_TYPES_TARGETING, SOURCE_TYPES_TARGETING } from "./TargetConstants";

/**
 * Targets Table is responsible for building a simple array of records,
 * storing entities that target other entities
 * It also provides helper methods for querying/updating/modifying the table
 */
export class TargetsTable {
    flagScope; // FlagScopeTargeting; //"TargetsTable"
    flagKeyTargets = FlagsTargeting.targets;//"targets"
    socketScope;// = socketNameTargeting;//"module." + this.flagScope;
    records:ObjectSet;

    namespace:string;

    /**
     * The constructor initalizes all records to be of type ObjectSet. This is a wrapper
     * class that is required because Set compares two object instances, which is not
     * what we need.
     * @param {String} scope The scope needs to match an existing module
     */
    constructor(scope:string) {
        this.records = new ObjectSet();
        this.flagScope = scope;
        this.socketScope = "module." + this.flagScope;
        this.namespace = scope;

        if(game.scenes.active){
            if ( (typeof game.scenes.active.getFlag(this.flagScope, this.flagKeyTargets)) === 'undefined') {
                game.scenes.active.setFlag(this.flagScope, this.flagKeyTargets, this.records);
            }
        }

        if (game.isGM) {
          this.initGMListener();
        }
    }

    async initGMListener() {
        game.socket.on(this.socketScope, async data => {
            switch (data.type) {
                case SOCKET_MESSAGE_TYPES_TARGETING.ADD_TARGET :
                  {
                    this.addTargetFromPlayer(data.payload);
                    break;
                  }
                case SOCKET_MESSAGE_TYPES_TARGETING.DELETE_TARGET :
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
    async addTarget(source: User | Token, target : Token | string, data : any) {

        let messageType = SOCKET_MESSAGE_TYPES_TARGETING.ADD_TARGET;
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
        t.setFlag(this.namespace,FlagsTargeting.target,data);
        t[FlagsTargeting.target].addChild(data);
        this.storeTable();
    }


    /**
     * This should be called from the initGMListener
     * It should only be executed by the GM
     * @param {TokenTarget} record the record to be added
     */
    async addTargetFromPlayer(record: TokenTarget) {
        await this.records.add(record);
        this.storeTable();
    }

    async sendSocketData(dataToSend, messageType) {
        let res = await game.socket.emit(this.socketScope, {
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
    async removeTarget(source: User | Token, target: Token | string) {
        let messageType = SOCKET_MESSAGE_TYPES_TARGETING.DELETE_TARGET;
        let t = (target instanceof Token) ? target : this.getTokenByTokenId(target);
        let record = await this.getRecord(source,t);
        this.records.delete(record);
        if (!game.user.isGM) {
            this.sendSocketData(record,messageType);
            return;
        }
        t.unsetFlag(this.namespace,FlagsTargeting.target);
        t[FlagsTargeting.target].removeChild()
        this.storeTable();
    }

    /**
     * This should be called from the initGMListener
     * It should only be executed by the GM
     * @param {TokenTarget} record the record to be removed
     */
    async removeTargetFromPlayer(record:TokenTarget) {
        await this.records.delete(record);
        this.storeTable();
    }

    /**
     * Get everyone targeting a given source
     * @param {*} target
     */
    async getTargetSources(target: Token | string):Promise<TokenTarget[]> {
        let t = (target instanceof Token) ? target : this.getTokenByTokenId(target);
        let returnValues = [];
        let vals:TokenTarget[] = await this.records.values();
        returnValues.push(vals.filter(obj => {
           return obj.targetID === t.id
        }));
        return returnValues;

    }

    /**
     * Get all targets for a given source
     * @param {*} source
     */
    async getSourceTargets(source: User | Token):Promise<TokenTarget[]> {
        let returnValues = [];
        let vals = await this.records.values();
        console.log(vals);
        console.log(source);
        returnValues.push(vals.filter( obj => {
          return obj.sourceID === source.id
        }));
        return returnValues;
    }

    /**
     * dump the entire table
     */
    async getAllRecords() {
        return await this.records.values();
    }

    /**
     * Get record
     * @param {*} source
     * @param {*} target
     */
    getRecord(source: User | Token, target:Token):TokenTarget {
        let record:TokenTarget;
        for(let recordTmp of this.records.values()){
          let idTmp:string = (<TokenTarget>recordTmp).getID();
          if(idTmp == String(target.id+"_"+source.id)){
            record = recordTmp;
            break;
          }
        }
        if(!record){
          if (source instanceof User) {
              if (source.isGM) {
                  // check if GM controls tokens
                  // TODO
                  record = new TokenTarget(target.id, source.id, SOURCE_TYPES_TARGETING.SOURCE_TYPE_GM);
              } else {
                  record = new TokenTarget(target.id, source.id, SOURCE_TYPES_TARGETING.SOURCE_TYPE_PLAYER);
              }
          } else if (source instanceof Token) {
              record = new TokenTarget(target.id, source.id, SOURCE_TYPES_TARGETING.SOURCE_TYPE_TOKEN);
          }
        }
        return record;
    }

    /**
     * Store the records table in a flag; only works if GM/AssistGM
     */
    async storeTable() {

        let scene = game.scenes.active;
        scene.unsetFlag(this.flagScope, this.flagKeyTargets);
        return await scene.setFlag(this.flagScope,this.flagKeyTargets,this.records);
    }


    /**
     * dump the entire table
     */
    async clear() {
      return this.records.values();
    }

    // UTILITY

    /**
     * Helper function to get a token by its ID
     * @param {int} item the id of the token we're looking for
     */
    private getTokenByTokenId(tokenId:string) {
        return this.getCanvas().tokens.placeables.find(x => { return x.id === tokenId });
    }

    /**
     * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
     * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
     * That's why you get errors when you try to access properties on canvas other than ready.
     * In order to get around that, you need to type guard canvas.
     * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
     * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
     * @returns
     */
    private getCanvas(): Canvas {
        if (!(canvas instanceof Canvas) || !canvas.ready) {
            throw new Error("Canvas Is Not Initialized");
        }
        return canvas;
    }
}


// Hooks.on('init', TargetsTable.init);
//@ts-ignore
window.TargetsTable = TargetsTable;




