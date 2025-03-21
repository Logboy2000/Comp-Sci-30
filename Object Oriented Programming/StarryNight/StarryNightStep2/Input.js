let Input = {
	mouse: {
		x: 0,
		y: 0,
	},
	pressedKeys: {},
	pressedMouse: {},

	addEventListeners: function () {
		// Input Object
		document.addEventListener('keydown', (e) => {
			this.pressedKeys[e.key] = true
			// console.log(e.key)
		})
		document.addEventListener('keyup', (e) => {
			this.pressedKeys[e.key] = false
		})
		document.addEventListener('mousedown', (e) => {
			this.pressedMouse[e.button] = true
		})
		document.addEventListener('mouseup', (e) => {
			this.pressedMouse[e.button] = false
		})
		document.addEventListener('mousemove', (e) => {
			this.mouse.x = e.clientX
			this.mouse.y = e.clientY
		})
	},

	isKeyPressed: function (key) {
		return this.pressedKeys[key]
	},
	isMousePressed: function (mouseButton) {
		return this.pressedMouse[mouseButton]
	},
	getMousePosition: function () {
		return {
			x: this.mouse.x,
			y: this.mouse.y,
		}
	},
}