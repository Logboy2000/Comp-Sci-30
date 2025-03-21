class Galaxy {
	constructor(x, y, w, h, initialStarCount, starColor = '#FFFFFF') {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.r = 0
		this.starColor = starColor
		this.stars = []

		
		for (var i = 0; i < initialStarCount; i++) {
			this.addStar(
				Math.random() * this.w,
				Math.random() * this.h,
				Math.random() * 2 + 1,
				this.starColor
			)
		}
	}

	addStar = function (x, y, size, color) {
		this.stars.push(new Star(x, y, size, color))
	}

	draw = function (ctx) {
		if (Input.isKeyPressed('r')){
			this.r += 0.1
		}
		if (Input.isKeyPressed('`')){
			ctx.strokeStyle = '#0000FF'
			ctx.strokeRect(this.x, this.y, this.w, this.h)
		}
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.rotate(this.r)
		for (var i = 0; i < this.stars.length; i++) {
			this.stars[i].draw(ctx)
		}
		ctx.restore()
	}
}
