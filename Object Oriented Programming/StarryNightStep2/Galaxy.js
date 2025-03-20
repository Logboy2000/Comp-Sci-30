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
			this.addStar(
				Math.random() * this.w,
				Math.random() * this.h,
				Math.random() * 2 + 1,
				this.starColor
			)
		}
	}
	
	addStar(x, y, size, color) {
		this.stars.push(new Star(x, y, size, color))
	}

	draw(ctx) {
		for (var i = 0; i < this.stars.length; i++) {
			this.stars[i].draw(ctx)
		}
	}
}
