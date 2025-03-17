let canvas, ctx

function loaded() {
	canvas = document.getElementById('canvas')
	ctx = canvas.getContext('2d')
	canvas.width = 1280
	canvas.height = 720

	update()
}

function update() {
	ctx.fillStyle = '#00FF00'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	RedBox.update()
	BlueBox.update()
	RedBox.draw(ctx)
	BlueBox.draw(ctx)
	requestAnimationFrame(update)
}