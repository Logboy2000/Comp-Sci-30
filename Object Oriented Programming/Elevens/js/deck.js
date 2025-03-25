class Deck {
	#cards
	
	constructor(cards) {
		this.#cards = cards
	}

	isEmpty = function() {
		return this.#cards.length == 0
	}

	deal = function() {
		if (this.isEmpty()) {
			console.warn("Deck is empty: returning null")
			return null
		}
		return this.#cards.pop()
	}

	shuffle = function() {
	}

	getCard = function(index) {
		return this.#cards[index]
	}

	getSize = function() {
		return this.#cards.length
	}

	addCard = function(card) {
		this.#cards.push(card)
	}

	removeCard(index) {
		return this.#cards.splice(index, 1)
	}
}
