//Card constructor
//to be used with deck.js

class Card {
	#rank
	#suit
	#value
	#sheetX
	#sheetY
	#sheetSelectedX
	#sheetSelectedY

	constructor(
		rank,
		suit,
		value,
		sheetX,
		sheetY,
		sheetSelectedX,
		sheetSelectedY,
		spritesheet
	) {
		this.spritesheet = spritesheet


		this.x = 0
		this.y = 0
		this.w = 73
		this.h = 97
		this.#rank = rank
		this.#suit = suit
		this.#value = value
		this.#sheetX = sheetX
		this.#sheetY = sheetY
		this.#sheetSelectedX = sheetSelectedX
		this.#sheetSelectedY = sheetSelectedY
	}

	getSuit = function () {
		return this.#suit
	}

	getRank = function () {
		return this.#rank
	}

	getValue = function () {
		return this.#value
	}

	setSuit = function (v) {
		this.#suit = v
	}

	setRank = function (v) {
		this.#rank = v
	}

	setValue = function (v) {
		this.#value = v
	}

	setPosition(x, y) {
		this.x = x
		this.y = y
	}

	getPosition() {
		return { x: this.x, y: this.y }
	}

	checkCollision = function (x, y) {
		// Check if the given (x, y) coordinates are within the bounds of the card
		if (
			x >= this.x &&
			x <= this.x + this.w &&
			y >= this.y &&
			y <= this.y + this.h
		) {
			return true
		}

		return false
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {*} x
	 * @param {*} y
	 */
	draw = function (ctx, isSelected) {
		//draw the card
		if (isSelected){
			ctx.drawImage(
				this.spritesheet,
				this.#sheetSelectedX,
				this.#sheetSelectedY,
				this.w,
				this.h,
				this.x,
				this.y,
				this.w,
				this.h
			)
		} else {
			ctx.drawImage(
				this.spritesheet,
				this.#sheetX,
				this.#sheetY,
				this.w,
				this.h,
				this.x,
				this.y,
				this.w,
				this.h
			)
		}

	}
}
