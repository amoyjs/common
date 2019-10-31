type addon = (core: any) => void

declare module '@amoy/common' {
    function forin(object: object, fn: (key?: string, value?: any) => void) : void
    function type(target: any) : 'boolean' | 'number' | 'string' | 'function' | 'array' | 'date' | 'regExp' | 'object' | 'error' | 'symbol'
    function getValue(root: any, get: string) : any
    function setValue(tar: any, key: string, value: any) : void
    function extend(...args) : object
    function eventify(target: object): object
    function usesify(addons: addon | addon[]): ((target: any) => void)
}