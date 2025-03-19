// Main.js
let canvas, ctx, galaxy

function loaded() {
	canvas = getElement('canvas')
	ctx = canvas.getContext('2d')

	resizeCanvas()
	window.addEventListener('resize', resizeCanvas)

	Input.startListening()

	galaxy = new Galaxy(canvas.width * 2, canvas.height * 2, 1000)

	update()
}

function resizeCanvas() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

function update() {
	// Clear Screen
	ctx.fillStyle = '#000000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Stars/Galaxy
	galaxy.update()
	galaxy.draw(ctx)

	requestAnimationFrame(update)
}

function randomRange(low, high) {
	return Math.random() * (high - low + 1) + low
}

function getElement(id) {
	return document.getElementById(id)
}
