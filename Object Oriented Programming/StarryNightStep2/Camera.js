class Camera {
	constructor(
		x = 0,
		y = 0,
		zoom = 1,
		leftX = -Infinity,
		rightX = Infinity,
		topY = -Infinity,
		bottomY = Infinity
	) {
		this.x = x
		this.y = y
		this.zoom = zoom
		this.moveSpeed = 10
		this.zoomSpeed = 1.01
        this.scrollZoomSpeed = 1.25
		this.minZoom = 0.1
		this.maxZoom = 10
		this.leftX = leftX
		this.rightX = rightX
		this.topY = topY
		this.bottomY = bottomY
        this.targetX = x
        this.targetY = y
        this.targetZoom = zoom
	}
	get width() {
		return window.innerWidth / this.zoom
	}
	get height() {
		return window.innerHeight / this.zoom
	}
	update() {
		// Move
		if (Input.isKeyPressed('ArrowLeft') || Input.isKeyPressed('a')) {
			this.targetX -= this.moveSpeed / this.zoom
		}
		if (Input.isKeyPressed('ArrowRight') || Input.isKeyPressed('d')) {
			this.targetX += this.moveSpeed / this.zoom
		}
		if (Input.isKeyPressed('ArrowUp') || Input.isKeyPressed('w')) {
			this.targetY -= this.moveSpeed / this.zoom
		}
		if (Input.isKeyPressed('ArrowDown') || Input.isKeyPressed('s')) {
			this.targetY += this.moveSpeed / this.zoom
		}
		if (Input.isKeyPressed('+') || Input.isKeyPressed('=')) {
			this.zoomTo(this.targetZoom * this.zoomSpeed)
		}
		if (Input.isKeyPressed('-') || Input.isKeyPressed('_')) {
            this.zoomTo(this.targetZoom / this.zoomSpeed)
		}
		// Clamp
		if (this.targetX < this.leftX) {
			this.targetX = this.leftX
		}
		if (this.targetX > this.rightX - this.width) {
			this.targetX = this.rightX - this.width
		}
		if (this.targetY < this.topY) {
			this.targetY = this.topY
		}
		if (this.targetY > this.bottomY - this.height) {
			this.targetY = this.bottomY - this.height
		}

		this.x = lerp(this.x, this.targetX, 0.1)
		this.y = lerp(this.y, this.targetY, 0.1)
        this.zoom = lerp(this.zoom, this.targetZoom, 0.1)
	}
	zoomTo(zoom) {
		const newZoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom)
		if (
			this.x >= this.leftX &&
			this.x <= this.rightX - window.innerWidth / newZoom &&
			this.y >= this.topY &&
			this.y <= this.bottomY - window.innerHeight / newZoom
		) {
			this.targetZoom = newZoom
		}
	}
}
