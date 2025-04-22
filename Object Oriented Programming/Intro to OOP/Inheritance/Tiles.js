class Tile {
	#x
	#y
	#id
	#name
	#color
	#health
	constructor(x, y, id, name, health = 1, color = '#FFFFFF') {
		this.setPosition(x, y)
		this.#id = id
		this.#name = name
		this.#color = color
		this.#health = health
		this.isDestroyed = false
	}
	setPosition(x, y) {
		this.#x = x
		this.#y = y
	}
	getID() {
		return this.#id
	}
	destroy() {
		this.isDestroyed = true
		console.log('Tile destroyed')
	}
	hit() {
		this.#health--
		this.updateDestroyed()
	}
	setHealth = function (num) {
		this.#health = num
		this.updateDestroyed()
	}
	updateDestroyed() {
		if (this.#health <= 0) {
			this.destroy()
		}
	}
	getColor() {
		return this.#color
	}
}

class GrassTile extends Tile {
	constructor(x, y) {
		super(x, y, 'grass', 'Grass Tile', 1, '#00FF00')
		this.canGrow = true
	}

	interact() {
		if (!this.isDestroyed) {
			console.log('You step on some soft, ' + this.getColor() + ' grass')
		}
	}

	regrow() {
		if (this.isDestroyed && this.canGrow) {
			console.log('The grass regrows...')
			this.isDestroyed = false
			this.setHealth(1)
		}
	}
}

class StoneTile extends Tile {
	constructor(x, y) {
		super(x, y, 'stone', 'Stone Tile', 3, '#4f4f4f')
		this.breakable = true
	}

	interact() {
		console.log('You touch a cold, hard stone')
	}

	destroy() {
		if (this.breakable) {
			super.destroy()
			console.log('Stone crumbles')
		} else {
			console.log('This stone cannot be broken')
		}
	}
}

