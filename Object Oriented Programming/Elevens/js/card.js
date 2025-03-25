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
		sheetSrc
	) {
		this.#rank = rank
		this.#suit = suit
		this.#value = value
		this.#sheetX = sheetX
		this.#sheetY = sheetY
		this.#sheetSelectedX = sheetSelectedX
		this.#sheetSelectedY = sheetSelectedY
		this.sheetImg = new Image()
		this.sheetImg.src = sheetSrc

	}

	getSuit = function() {
		return this.#suit;
	}

	getRank = function() {
		return this.#rank;
	}

	getValue = function() {
		return this.#value;
	}

	setSuit = function(v) {
		this.#suit = v;
	}

	setRank = function(v) {
		this.#rank = v;
	}

	setValue = function(v) {
		this.#value = v;
	}

	/**
	 * 
	 * @param {CanvasRenderingContext2D} ctx 
	 * @param {*} x 
	 * @param {*} y 
	 */
	draw = function(ctx, x, y){
		//draw the card
		ctx.drawImage(this.sheetImg, this.#sheetX, this.#sheetY, 73, 98, x, y, 73, 98)
		
	}
}

