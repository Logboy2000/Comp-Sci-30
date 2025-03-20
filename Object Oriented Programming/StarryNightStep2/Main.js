// Variables
let canvas, ctx, galaxy, directionInputDisplay, camera, debugMenu

function loaded() {
	// Elements
	canvas = getElement('canvas')
	ctx = canvas.getContext('2d')
	resizeCanvas()

	// Objects
	galaxy = new Galaxy(canvas.width * 3, canvas.height * 3, 10000)
	camera = new Camera(0, 0, 1, 0, galaxy.w, 0, galaxy.h)
	debugMenu = new DebugMenu()
	debugMenu.addLabel('Star Count', galaxy.stars.length)
	debugMenu.addLabel('Camera X', '0')
	debugMenu.addLabel('Camera Y', '0')
	debugMenu.addLabel('Camera Zoom', '1')

	directionInputDisplay = new DirectionInputDisplay(
		canvas.width - 200,
		canvas.height + 200,
		2
	)

	// Event Listeners
	window.addEventListener('resize', resizeCanvas)
	Input.addEventListeners()
	document.addEventListener('wheel', (e) => {
		if (e.deltaY < 0) {
			camera.zoomTo(camera.zoom * camera.scrollZoomSpeed)
		} else {
			camera.zoomTo(camera.zoom / camera.scrollZoomSpeed)
		}
	})

	// Start Loop
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

	// Update
	camera.update()
	debugMenu.updateLabel('Camera X', camera.x.toFixed(4))
	debugMenu.updateLabel('Camera Y', camera.y.toFixed(4))
	debugMenu.updateLabel('Camera Zoom', camera.zoom.toFixed(4))

	// Drawing
	ctx.save()
	ctx.translate(-camera.x * camera.zoom, -camera.y * camera.zoom)
	ctx.scale(camera.zoom, camera.zoom)
	draw(ctx)
	ctx.restore()
	drawUI(ctx)

	// Loop
	requestAnimationFrame(update)
}

function draw(ctx) {
	// Clear Screen
	ctx.fillStyle = '#000000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw
	galaxy.draw(ctx)

	if (Input.isKeyPressed('`')) {
		ctx.strokeStyle = '#FF0000'
		ctx.strokeWidth = 5
		ctx.strokeRect(
			camera.leftX,
			camera.topY,
			camera.rightX - camera.leftX,
			camera.bottomY - camera.topY
		)
	}
}

function drawUI(ctx) {
	// Draw
	directionInputDisplay.draw(ctx)

	if (Input.isKeyPressed('`')) {
		debugMenu.draw(ctx)
	}
}

function randomRange(low, high) {
	return Math.random() * (high - low + 1) + low
}

function getElement(id) {
	return document.getElementById(id)
}

function lerp(a, b, t) {
	return a + (b - a) * t
}

function drawCircle(ctx, x, y, radius, color) {
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, Math.PI * 2)
	ctx.fillStyle = color
	ctx.fill()
}
