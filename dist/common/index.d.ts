export * from './event';
export * from './eventify';
export * from './extend';
export * from './usesify';
export * from './performance';
export declare function getQuery(name: string): any;
export declare function isEmpty(target: any): boolean;
export declare function type(object: any): any;
export declare function forin(object: object, fn: (key?: string, value?: any) => void): void;
export declare const getValue: (root: any, get: string) => any;
export declare const setValue: (tar: any, key: string, value: any) => void;