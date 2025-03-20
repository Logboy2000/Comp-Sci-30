class DebugMenu {
    constructor() {
        this.labels = new Map()
    }

    addLabel(key, text) {
        this.labels.set(key, text)
    }

    removeLabel(key) {
        this.labels.delete(key)
    }

    updateLabel(key, text) {
        if (this.labels.has(key)) {
            this.labels.set(key, text)
        }
    }

    draw(ctx) {
        let yOffset = 20
        ctx.font = '14px Arial'
        ctx.fillStyle = '#FFFFFF'
        
        for (let [key, text] of this.labels) {
            ctx.fillText(`${key}: ${text}`, 10, yOffset)
            yOffset += 20
        }
    }
}
