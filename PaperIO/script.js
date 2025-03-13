let canvas, ctx, player, mouseX, mouseY

window.onload = loaded

function loaded() {
	canvas = getElement('canvas')
	ctx = canvas.getContext('2d')

	player = new Player()

	mouseX = canvas.width / 2
	mouseY = canvas.height / 2

	canvas.addEventListener('mousemove', updateMousePosition)

	setInterval(update, 1000 / 60)
}

function updateMousePosition(event) {
	const rect = canvas.getBoundingClientRect()
	mouseX = event.clientX - rect.left
	mouseY = event.clientY - rect.top
}

function update() {

	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight


	ctx.fillStyle = 
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.beginPath()
	ctx.moveTo(player.x, player.y)
	player.update()
	ctx.lineWidth = 100
	ctx.lineTo(player.x,player.y)
	ctx.strokeStyle = '#FF5555'
	ctx.stroke()



	player.draw()
}

class Player {
	constructor() {
		this.x = canvas.width / 2
		this.y = canvas.height / 2
		this.w = 40
		this.h = 40
		this.speed = 4
		this.angle = 0
	}

	update() {
		// Calculate angle to the mouse
		let dx = mouseX - this.x
		let dy = mouseY - this.y
		this.angle = Math.atan2(dy, dx)

		// Move in the direction of the angle
		this.x += Math.cos(this.angle) * this.speed
		this.y += Math.sin(this.angle) * this.speed
	}

	draw() {
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.rotate(this.angle)

		// Draw player as a rotated rectangle
		ctx.fillStyle = '#FF0000'
		ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)

		ctx.restore()
	}
}

/**
 * A shorthand for document.getElementById
 * @param {String} id The id of the HTML element to get
 * @returns {HTMLElement}
 */
function getElement(id) {
	return document.getElementById(id)
}
