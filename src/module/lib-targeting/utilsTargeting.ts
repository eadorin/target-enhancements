export enum SOURCE_TYPES_TARGETING {
  SOURCE_TYPE_TOKEN  = 0,
  SOURCE_TYPE_PLAYER = 1,
  SOURCE_TYPE_GM     = 2
};

export enum SOCKET_MESSAGE_TYPES_TARGETING {
  ADD_TARGET = 0,
  DELETE_TARGET = 1,
};

/**
* Flag Info
*/
export const FlagScopeTargeting = "TargetsTable";
export enum FlagsTargeting {
   target = 'target', // Single target element on token
   targets = 'targets' // Multiple Targets on token
};

/**
* Socket Info
*/
export const socketNameTargeting = 'module.'+"TargetsTable";
export enum socketActionTargeting {
   Target = 0,
   Untarget = 1,
};
