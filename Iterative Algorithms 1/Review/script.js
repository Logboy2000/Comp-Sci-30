function loaded() {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.clientWidth = 5000
    canvas.clientHeight = 4000

    setInterval(update, 1000 / 60, canvas, ctx)
}
function update(canvas, ctx) {
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
    for (var x = 0; x < 5; x++) {
        for (var y = 0; y < 5; y++) {
            drawFace(ctx, x * 200, y * 200)
        }
    }
}


/**
 * Draws a predefined face on a canvas context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Number} x 
 * @param {Number} y 
 */
function drawFace(ctx, x = 0, y = 0) {
    drawCircle(ctx, x + 100, y + 100, 100, '#FF0000')
    drawCircle(ctx, x + 100, y + 100, 70, '#80231c', true)
    drawCircle(ctx, x + 50, y + 60, 30, '#FFFFFF')
    drawCircle(ctx, x + 150, y + 60, 30, '#FFFFFF')
    drawCircle(ctx, x + 50, y + 60, 15, '#000000')
    drawCircle(ctx, x + 150, y + 60, 15, '#000000')
    for (var i = 1; i < 5; i += 1) {
        drawCircle(ctx, x + i * 40, y + 100, 10, '#FFFFFF', true)
    }
}
/**
 * Draws a circle on a canvas context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} r 
 * @param {String} color 
 * @param {Boolean} halfCircle 
 */
function drawCircle(ctx, x = 0, y = 0, r = 100, color = '#FFFFFF', halfCircle = false) {
    ctx.beginPath()
    if (halfCircle) {
        ctx.arc(x, y, r, 0, 1 * Math.PI)
    } else {
        ctx.arc(x, y, r, 0, 2 * Math.PI)
    }

    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
}