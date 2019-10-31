export function eventify(target: any) {
    target.callbacks = {}

    target.on = (eventName: string, callback: () => void) => {
        if (!eventName || !callback) return target
        if (!target.hasOwnProperty("callbacks")) target.callbacks || (target.callbacks = {})

        let base: any
        const events = eventName.split(" ")
        events.map((eventName) => {
            (base = target.callbacks)[eventName] || (base[eventName] = [])
            target.callbacks[eventName].push(callback)
        })

        return target
    }

    target.emit = (...args: any) => {
        const eventName = args.shift() as string
        const events = eventName.split(" ")
        events.map((eventName) => {
            const list = target.callbacks !== null ? target.callbacks[eventName] || [] : []
            if (list.length) {
                list.map((item: () => void) => {
                    item && item.apply(target, args)
                })
            }
        })

        return target
    }

    target.off = (...args: any) => {
        if (args.length === 0) {
            target.callbacks = {}
        } else {
            const eventName = args.shift() as string
            const events = eventName.split(" ")
            events.map((eventName) => delete target.callbacks[eventName])
        }

        return target
    }

    return target
}
