// Input Object
document.addEventListener('keydown', (e) => {
	Input.pressedKeys[e.key] = true
})
document.addEventListener('keyup', (e) => {
	Input.pressedKeys[e.key] = false
})
document.addEventListener('mousedown', (e) => {
	Input.pressedMouse[e.button] = true
	console.log(e.button)
})
document.addEventListener('mouseup', (e) => {
	Input.pressedMouse[e.button] = false
})
document.addEventListener('mousemove', (e) => {
	Input.mouse.x = e.clientX
	Input.mouse.y = e.clientY
})
let Input = {
	mouse: {
		x: 0,
		y: 0,
	},
	pressedKeys: {},
	pressedMouse: {},

	isKeyPressed: function (key) {
		if (this.pressedKeys[key] == true) {
			console.log(key)
		}
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