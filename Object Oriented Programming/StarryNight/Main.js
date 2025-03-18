let canvas, ctx

function loaded() {
	canvas = getElement('canvas')
	ctx = canvas.getContext('2d')

	canvas.width = 500
	canvas.height = 500

	update()
}

function update() {
	ctx.fillStyle = '#000000'
	ctx.fillRect(0,0,canvas.width,canvas.height)

	requestAnimationFrame(update)
}

function randomRange(low, high) {
	return Math.random() * (high - low + 1) + low
}

function getElement(id) {
	return document.getElementById(id)
}