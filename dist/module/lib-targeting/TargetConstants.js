export var SOURCE_TYPES_TARGETING;
(function (SOURCE_TYPES_TARGETING) {
    SOURCE_TYPES_TARGETING[SOURCE_TYPES_TARGETING["SOURCE_TYPE_TOKEN"] = 0] = "SOURCE_TYPE_TOKEN";
    SOURCE_TYPES_TARGETING[SOURCE_TYPES_TARGETING["SOURCE_TYPE_PLAYER"] = 1] = "SOURCE_TYPE_PLAYER";
    SOURCE_TYPES_TARGETING[SOURCE_TYPES_TARGETING["SOURCE_TYPE_GM"] = 2] = "SOURCE_TYPE_GM";
})(SOURCE_TYPES_TARGETING || (SOURCE_TYPES_TARGETING = {}));
;
export var SOCKET_MESSAGE_TYPES_TARGETING;
(function (SOCKET_MESSAGE_TYPES_TARGETING) {
    SOCKET_MESSAGE_TYPES_TARGETING[SOCKET_MESSAGE_TYPES_TARGETING["ADD_TARGET"] = 0] = "ADD_TARGET";
    SOCKET_MESSAGE_TYPES_TARGETING[SOCKET_MESSAGE_TYPES_TARGETING["DELETE_TARGET"] = 1] = "DELETE_TARGET";
})(SOCKET_MESSAGE_TYPES_TARGETING || (SOCKET_MESSAGE_TYPES_TARGETING = {}));
;
/**
* Flag Info
*/
export const FlagScopeTargeting = "TargetsTable";
export var FlagsTargeting;
(function (FlagsTargeting) {
    FlagsTargeting["target"] = "target";
    FlagsTargeting["targets"] = "targets"; // Multiple Targets on token THIS IS SET ON THE SCENE
})(FlagsTargeting || (FlagsTargeting = {}));
;
/**
* Socket Info
*/
export const socketNameTargeting = 'module.' + "TargetsTable";
export var socketActionTargeting;
(function (socketActionTargeting) {
    socketActionTargeting[socketActionTargeting["Target"] = 0] = "Target";
    socketActionTargeting[socketActionTargeting["Untarget"] = 1] = "Untarget";
})(socketActionTargeting || (socketActionTargeting = {}));
;
