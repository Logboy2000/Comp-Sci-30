// Variables
let canvas, ctx, universe, directionInputDisplay, camera, debugMenu, fpsGraph
let lastFrameTime = performance.now() // Track last frame time
let fps = 0 // FPS variable

function loaded() {
	// Elements
	canvas = getElement('canvas')
	ctx = canvas.getContext('2d')
	resizeCanvas()

	// Objects
	universe = new Universe(canvas.width * 2, canvas.height * 2, 10)
	camera = new Camera(0, 0, 1, 0, universe.w, 0, universe.h)
	fpsGraph = new Graph({
		yellowThreshold: 40,
		greenThreshold: 60,
		labelCount: 5,
		stepSize: 20,
		minYScale: 200,
		decimalPlaces: 2,
		higherIsBetter: true,
	})
	debugMenu = new DebugMenu()
	debugMenu.addLabel('Galaxy Count', universe.galaxys.length)
	debugMenu.addLabel('Camera X', '0')
	debugMenu.addLabel('Camera Y', '0')
	debugMenu.addLabel('Camera Zoom', '1')
	debugMenu.addLabel('FPS', '0') // Add FPS label

	directionInputDisplay = new DirectionInputDisplay(5, 5, 2)

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

function update() {
	let currentTime = performance.now()
	let deltaTime = (currentTime - lastFrameTime) / 1000 // Convert to seconds
	lastFrameTime = currentTime
	fps = (1 / deltaTime).toFixed(1) // Calculate FPS

	// Clear Screen
	ctx.fillStyle = '#000000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Update
	if (Input.isMousePressed(0) == true) {
	}
	camera.update()
	debugMenu.updateLabel('Camera X', camera.x.toFixed(4))
	debugMenu.updateLabel('Camera Y', camera.y.toFixed(4))
	debugMenu.updateLabel('Camera Zoom', camera.zoom.toFixed(4))
	debugMenu.updateLabel('FPS', fps)

	// Drawing
	ctx.save()
	ctx.translate(-camera.x * camera.zoom, -camera.y * camera.zoom)
	ctx.scale(camera.zoom, camera.zoom)
	ctx.rotate(camera.r)

	draw(ctx)

	ctx.restore()

	drawUI(ctx)

	// Loop
	requestAnimationFrame(update)
}

function resizeCanvas() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

function draw(ctx) {
	// Clear Screen
	ctx.fillStyle = '#000000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw
	universe.draw(ctx)

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
	fpsGraph.drawGraph(ctx, fps, 100, 100, 100, 100, 'FPS', 'Time', 'FPS')

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
