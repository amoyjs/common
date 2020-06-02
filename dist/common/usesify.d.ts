declare type addon = (core: any) => void;
export declare function usesify(addons: addon | addon[]): (target: any) => void;
export {};
