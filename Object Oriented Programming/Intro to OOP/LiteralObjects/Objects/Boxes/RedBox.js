
let RedBox = {
	x: 10,
	y: 10,
	w: 120,
	h: 60,
	xd: 0,
	yd: 0,

	moveSpeed: 10,
	color: '#FF0000',

	update: function () {
		if (Input.isMousePressed(0)){
			RedBox.scale(1.05)
		}
		if (Input.isMousePressed(2)){
			RedBox.scale(0.95)
		}




		this.xd = 0
		this.yd = 0

		if (Input.isKeyPressed('ArrowUp') || Input.isKeyPressed('w')) {
			this.yd--
		}
		if (Input.isKeyPressed('ArrowDown') || Input.isKeyPressed('s')) {
			this.yd++
		}
		if (Input.isKeyPressed('ArrowLeft') || Input.isKeyPressed('a')) {
			this.xd--
		}
		if (Input.isKeyPressed('ArrowRight') || Input.isKeyPressed('d')) {
			this.xd++
		}

		this.move(this.xd * this.moveSpeed, this.yd * this.moveSpeed)
	},

	draw: function (ctx) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.w, this.h)
	},

	move: function (dx, dy) {
		this.x += dx
		this.y += dy
	},

	scale: function (scaleFactor) {
		this.w *= scaleFactor
		this.h *= scaleFactor
	},
}