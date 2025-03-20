class Universe {
	constructor(
		w,
		h,
		startingGalaxyCount,
		minGalaxyStars = 100,
		maxGalaxyStars = 1000,
		minGalaxyW = 100,
		maxGalaxyW = 1000,
		minGalaxyH = 100,
		maxGalaxyH = 1000,
	) {
		this.w = w
		this.h = h
		this.galaxys = []
		this.minGalaxyStars = minGalaxyStars
		this.maxGalaxyStars = maxGalaxyStars

		for (var i = 0; i < startingGalaxyCount; i++) {
			this.addGalaxy(
				randomRange(0, this.w),
				randomRange(0, this.h),
				randomRange(minGalaxyW, maxGalaxyW),
				randomRange(minGalaxyH, maxGalaxyH),
				randomRange(minGalaxyStars,maxGalaxyStars)
			)
		}
	}

	addGalaxy = function (x, y, w, h, starCount) {
		this.galaxys.push(new Galaxy(x, y, w, h, starCount))
	}

	draw = function (ctx) {
		for (var i = 0; i < this.galaxys.length; i++) {
			this.galaxys[i].draw(ctx)
		}
	}
}
