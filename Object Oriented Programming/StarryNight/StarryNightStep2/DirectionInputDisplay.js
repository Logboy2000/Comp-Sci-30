class DirectionInputDisplay {
	constructor(x = 0, y = 0, scale = 1, padding = 5) {
		this.x = x
		this.y = y
		this.scale = scale
		this.boxSize = 30
		this.padding = padding
	}

	draw(ctx) {
		ctx.fillStyle = 'white'
		if (Input.isKeyPressed('a') || Input.isKeyPressed('ArrowLeft')) {
			ctx.fillRect(
				this.x,
				(this.y + this.boxSize) * this.scale + this.padding,
				this.boxSize * this.scale,
				this.boxSize * this.scale
			)
		}
		if (Input.isKeyPressed('w') || Input.isKeyPressed('ArrowUp')) {
			ctx.fillRect(
				this.x + this.boxSize * this.scale + this.padding,
				this.y * this.scale,
				this.boxSize * this.scale,
				this.boxSize * this.scale
			)
		}
		if (Input.isKeyPressed('s') || Input.isKeyPressed('ArrowDown')) {
			ctx.fillRect(
				this.x + this.boxSize * this.scale + this.padding,
				(this.y + this.boxSize) * this.scale + this.padding,
				this.boxSize * this.scale,
				this.boxSize * this.scale
			)
		}
		if (Input.isKeyPressed('d') || Input.isKeyPressed('ArrowRight')) {
			ctx.fillRect(
				this.x + this.boxSize * 2 * this.scale + this.padding * 2,
				(this.y + this.boxSize) * this.scale + this.padding,
				this.boxSize * this.scale,
				this.boxSize * this.scale
			)
		}
	}
}