class Star {
	constructor(x, y, r, color = '#FFFFFF') {
		this.x = x
		this.y = y
		this.r = r
		this.color = color
		this.rotation = Math.random() * Math.PI * 2
	}

	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.rotate(this.rotation)

		ctx.fillRect(-this.r / 2, -this.r / 2, this.r, this.r)
		

		ctx.restore()
	}
}
