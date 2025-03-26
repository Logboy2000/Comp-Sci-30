class Deck {
	#cards

	constructor(cards = []) {
		this.#cards = cards
	}

	isEmpty = function () {
		return this.#cards.length == 0
	}

	deal = function () {
		if (this.isEmpty()) {
			console.warn('Deck is empty: returning null')
			return null
		}
		return this.#cards.pop()
	}

	shuffle = function () {
		const tempArray = []
		while (this.#cards.length > 0) {
			const randomIndex = Math.floor(Math.random() * this.#cards.length)
			tempArray.push(this.#cards.splice(randomIndex, 1)[0])
		}
		this.#cards = tempArray
	}

	getCard = function (index) {

		return this.#cards[index]
		
	}

	getSize = function () {
		return this.#cards.length
	}

	addCard = function (card, index) {
		this.#cards.splice(index, 0, card)
	}
	
	removeCard(index) {
		if (index < 0 || index >= this.#cards.length) {
			console.warn('Invalid card index: returning null')
			return null
		}
		return this.#cards.splice(index, 1)
	}
}
