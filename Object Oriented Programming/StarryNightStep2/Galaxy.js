class Galaxy {
	constructor(w, h, starCount, starColor = '#FFFFFF') {
		this.camX = 0
		this.camY = 0
		this.camSpeed = 10
		this.camZoom = 1
		this.w = w
		this.h = h
		this.starColor = starColor
		this.stars = []

		for (var i = 0; i < starCount; i++) {
			this.stars.push(
				new Star(
					randomRange(0, this.w),
					randomRange(0, this.h),
					randomRange(2, 5),
					starColor
				)
			)
		}
	}

	update() {
		// Move
		if (Input.isKeyPressed('ArrowLeft')) {
			this.camX = Math.max(0, this.camX - this.camSpeed)
		}
		if (Input.isKeyPressed('ArrowRight')) {
			this.camX = Math.min(this.w - canvas.width, this.camX + this.camSpeed)
		}
		if (Input.isKeyPressed('ArrowUp')) {
			this.camY = Math.max(0, this.camY - this.camSpeed)
		}
		if (Input.isKeyPressed('ArrowDown')) {
			this.camY = Math.min(this.h - canvas.height, this.camY + this.camSpeed)
		}
	}

	draw(ctx) {
		ctx.save()
		ctx.translate(-this.camX, -this.camY)

		for (var i = 0; i < this.stars.length; i++) {
			this.stars[i].draw(ctx)
		}
		ctx.restore()
	}
}
