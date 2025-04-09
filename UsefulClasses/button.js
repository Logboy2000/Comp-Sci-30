class CanvasButton {
	constructor(
		x,
		y,
		width,
		height,
		text,
		onClick,
		buttonColor = '#007BFF',
		borderColor = '#0056b3',
		textColor = '#FFFFFF'
	) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.text = text
		this.onClick = onClick
		this.buttonColor = buttonColor
		this.borderColor = borderColor
		this.textColor = textColor
	}

	draw(ctx) {
		// Draw button rectangle
		ctx.fillStyle = this.buttonColor // Button color
		ctx.fillRect(this.x, this.y, this.width, this.height)

		// Draw button border
		ctx.strokeStyle = this.borderColor // Border color
		ctx.strokeRect(this.x, this.y, this.width, this.height)

		// Draw button text
		ctx.fillStyle = this.textColor // Text color
		ctx.font = '16px Arial'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
	}

	isClicked(mouseX, mouseY) {
		return (
			mouseX >= this.x &&
			mouseX <= this.x + this.width &&
			mouseY >= this.y &&
			mouseY <= this.y + this.height
		)
	}

	setPosition(x, y) {
		this.x = x
		this.y = y
	}

	handleClick(mouseX, mouseY) {
		if (this.isClicked(mouseX, mouseY) && this.onClick) {
			this.onClick()
		}
	}
}
