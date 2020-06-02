type addon = (core: any) => void

export function usesify(addons: addon | addon[]) {
    return function use(target) {
        const _addons = Array.isArray(addons) ? addons : [addons]
        _addons.map((addon) => {
            if (typeof addon === "function") {
                addon(target)
            } else {
                throw Error(`[@amoy/components]error: addon ${addons} must be a function;`)
            }
        })
    }
}
