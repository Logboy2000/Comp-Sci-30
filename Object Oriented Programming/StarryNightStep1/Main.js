let canvas, ctx, stars

function loaded() {
	canvas = getElement('canvas')
	ctx = canvas.getContext('2d')

	canvas.width = 500
	canvas.height = 500

	stars = makeStarryNight(100)

	update()
}

function update() {
	ctx.fillStyle = '#000000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	drawStarryNight(ctx, stars)

	requestAnimationFrame(update)
}

function makeStarryNight(starCount = 100) {
	let outputStars = new Array()

	for (var i = 0; i < starCount; i++) {
		outputStars[outputStars.length] = new Star(
			randomRange(0, canvas.width),
			randomRange(0, canvas.height),
			randomRange(0.5, 2)
		)
	}

	return outputStars
}

function drawStarryNight(ctx, starArr) {
	for (var i = 0; i < starArr.length; i++) {
		starArr[i].draw(ctx)
	}
}

function randomRange(low, high) {
	return Math.random() * (high - low + 1) + low
}

function getElement(id) {
	return document.getElementById(id)
}
