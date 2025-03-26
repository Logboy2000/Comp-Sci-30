class Deck {
	#cardStack

	constructor(cards = []) {
		this.#cardStack = cards
	}

	isEmpty = function () {
		return this.#cardStack.length == 0
	}

	deal = function () {
		if (this.isEmpty()) {
			console.warn('Deck is empty: returning null')
			return null
		}
		return this.removeCard(0)
	}

	shuffle = function () {
		const tempArray = []
		while (this.#cardStack.length > 0) {
			const randomIndex = Math.floor(Math.random() * this.#cardStack.length)
			tempArray.push(this.#cardStack.splice(randomIndex, 1)[0])
		}
		this.#cardStack = tempArray
	}

	getCard = function (index) {

		return this.#cardStack[index]
		
	}

	getSize = function () {
		return this.#cardStack.length
	}

	addCard = function (card, index) {
		this.#cardStack.splice(index, 0, card)
	}

	setCard = function (card, index) {
		this.#cardStack[index] = card
	}

	
	removeCard(index) {
		if (index < 0 || index >= this.#cardStack.length) {
			console.warn('Invalid card index: returning null')
			return null
		}
		return this.#cardStack.splice(index, 1)[0]
	}
}
