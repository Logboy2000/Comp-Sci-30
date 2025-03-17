
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
			RedBox.changeSize(10,10)
		}




		this.xd = 0
		this.yd = 0

		if (Input.isKeyPressed('ArrowUp')) {
			this.yd--
		}
		if (Input.isKeyPressed('ArrowDown')) {
			this.yd++
		}
		if (Input.isKeyPressed('ArrowLeft')) {
			this.xd--
		}
		if (Input.isKeyPressed('ArrowRight')) {
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

	changeSize: function (dw, dh) {
		this.w += dw
		this.h += dh
	},
}