class Deck {
	#cardStack

	constructor(cards = []) {
		this.#cardStack = cards
	}

	/**
	 * Checks if the deck is empty
	 * @returns {boolean} True if the deck is empty, false otherwise
	 */
	isEmpty = function () {
		return this.#cardStack.length == 0
	}

	/**
	 * Deals a card from the deck
	 * @returns {Card} The card dealt from the deck, or null if the deck is empty
	 */
	deal = function () {
		if (this.isEmpty()) {
			console.log('Deck is empty: returning null')
			return null
		}
		const card = this.removeCard(0)
		if (!card) {
			console.error('Error: Failed to deal a card')
		}
		return card
	}

	/**
	 * Shuffles the deck
	 */
	shuffle = function () {
		const tempArray = []
		while (this.#cardStack.length > 0) {
			const randomIndex = Math.floor(Math.random() * this.#cardStack.length)
			tempArray.push(this.#cardStack.splice(randomIndex, 1)[0])
		}
		this.#cardStack = tempArray
	}

	/**
	 * Gets a card from the deck
	 * @param {number} index - The index of the card to get
	 * @returns {Card} The card at the specified index, or null if the index is out of bounds
	 */
	getCard = function (index) {
		return this.#cardStack[index]
	}

	/**
	 * Gets the size of the deck
	 * @returns {number} The number of cards in the deck
	 */
	getSize = function () {
		return this.#cardStack.length
	}

	/**
	 * Adds a card to the deck
	 * @param {Card} card - The card to add
	 * @param {number} index - The index to add the card at
	 */
	addCard = function (card, index = 0) {
		this.#cardStack.splice(index, 0, card)
	}

	/**
	 * Sets a card in the deck
	 * @param {Card} card - The card to set
	 * @param {number} index - The index to set the card at
	 */
	setCard = function (card, index) {
		this.#cardStack[index] = card
	}

	/**
	 * Replaces a card in the deck
	 * @param {Card} card - The card to replace
	 * @param {number} index - The index to replace the card at
	 * @returns {Card} The old card that was replaced, or null if the index is out of bounds
	 */
	replaceCard = function (card, index) {
		if (index < 0 || index >= this.#cardStack.length) {
			console.warn('Invalid card index: returning null')
			return null
		}
		const oldCard = this.#cardStack[index]
		this.#cardStack[index] = card
		return oldCard
	}

	/**
	 * Removes a card from the deck
	 * @param {number} index - The index of the card to remove
	 * @returns {Card} The card that was removed, or null if the index is out of bounds
	 */
	removeCard = function (index) {
		if (index < 0 || index >= this.#cardStack.length) {
			console.warn('Invalid card index: returning null')
			return null
		}
		return this.#cardStack.splice(index, 1)[0]
	}
}
