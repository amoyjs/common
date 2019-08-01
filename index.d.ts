declare namespace common {
    function type(target: any): string
    function isPlaintarget(target: any): boolean
    function extend(deep: boolean, target: any, srouce: any): object
    function extend(target: any, srouce: any): object
}