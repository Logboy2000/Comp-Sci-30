class Star {
	constructor(x, y, r, color = '#FFFFFF') {
		this.x = x
		this.y = y
		this.r = r
		this.color = color
	}

	draw(ctx) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
		ctx.fill()
	}
}
