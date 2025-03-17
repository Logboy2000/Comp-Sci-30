let BlueBox = {
	x: 100,
	y: 100,
	w: 60,
	h: 60,
	xd: 1,
	yd: 1,

	moveSpeed: 20,
	color: '#0000FF',

	update: function () {
		if (this.x + this.w > canvas.width) {
			this.xd = -1
		}
		if (this.x < 0) {
			this.xd = 1
		}
		if (this.y + this.h > canvas.height) {
			this.yd = -1
		}
		if (this.y < 0) {
			this.yd = 1
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