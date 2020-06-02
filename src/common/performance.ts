
let drawCalls: number
let fps: number

function catchDraws(app: any) {
    let i = 0
    app.renderer.addListener('prerender', () => {
        i = 0
    })
    app.renderer.addListener('postrender', () => {
        drawCalls = i
    })

    const olGrawElements = app.renderer.gl.drawElements.bind(app.renderer.gl)
    app.renderer.gl.drawElements = (...args: any[]) => {
        i++
        return olGrawElements(...args)
    }
}

function catchFPS() {
    let lastTime = performance.now()
    let frame = 0
    const loop = () => {
        const now = performance.now()
        frame++
        if (now >= 1000 + lastTime) {
            fps = Math.round((frame * 1000) / (now - lastTime))
            frame = 0
            lastTime = now
        }
        requestAnimationFrame(loop)
    }
    loop()
}

function createFPSAndDrawCallsPannel(showFps, showDrawCalls) {
    const container = document.createElement('div')
    container.id = 'stats'
    container.style.cssText = `position:fixed;
        left: 3rem;
        pointer-events: none;
        user-select: none;
        z-index:10000;
        color: #fff;
        font-size: 3rem;
        line-height: 3rem;`
    container.innerHTML = `${showFps ? "<p id='fps'>fps:</p>" : ''}${showDrawCalls ? "<p id='drawcalls'>drawCalls:</p>" : ''}`
    document.body.appendChild(container)
    const statsContainer = document.querySelector('#stats')
    const top = window.innerHeight - (statsContainer ? statsContainer.clientHeight : 0)
    container.style.top = top - 10 + 'px'
}

function handlePannelPosition() {
    const statsContainer = document.querySelector('#stats')
    setTimeout(() => {
        const container = document.getElementById('stats')
        if (container) {
            container.style.top = window.innerHeight - (statsContainer ? statsContainer.clientHeight : 0) - 10 + 'px'
        }
    }, 100)
}

export function showPerformancePannel(app: any, enables: string[] = ['fps', 'draw-calls']) {
    const showFps = enables.includes('fps')
    const showDrawCalls = enables.includes('draw-calls')
    showDrawCalls && catchDraws(app)
    showFps && catchFPS()
    createFPSAndDrawCallsPannel(showFps, showDrawCalls)

    const drawCallContainer = document.querySelector('#drawcalls')
    const fpsContainer = document.querySelector('#fps')

    setInterval(() => {
        drawCalls && drawCallContainer && (drawCallContainer.innerHTML = `drawCalls: ${drawCalls}`)
        fps && fpsContainer && (fpsContainer.innerHTML = `fps: ${fps}`)
    }, 200)

    window.addEventListener('resize', () => handlePannelPosition())
}

export function showPerformance(enables: string[] = ['fps', 'draw-calls']) {
    return (event: any) => event.on('created', ({ game }) => showPerformancePannel(game, enables))
}
