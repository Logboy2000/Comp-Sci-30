// Elevens Card Game
class ElevensGame {
	/**
	 * Creates an instance of ElevensGame.
	 * @param {HTMLCanvasElement} canvas - The canvas element for rendering the game.
	 * @param {Deck} deck - The deck of cards used in the game.
	 * @param {number} dipSize - The number of cards in the dip.
	 * @param {Image} bg - The background image for the game.
	 */
	constructor(canvas, deck, dipSize = 9, bg = null) {
		this.canvas = canvas
		this.ctx = this.canvas.getContext('2d')
		this.matches = 0
		this.deck = deck
		this.bg = bg
		this.dipSize = dipSize
		this.deckInPlay = new Deck()
		this.discards = new Deck()

		this.selectedCards = []

		this.imgWidth = 73
		this.imgHeight = 97

		this.canvas.addEventListener(
			'mousedown',
			this.mouseClicked.bind(this),
			false
		)

		// Make the canvas focusable and add a click listener to focus it
		this.canvas.setAttribute('tabindex', '0')
		this.canvas.addEventListener('click', () => {
			this.canvas.focus()
		})

		// Add keydown event listener to the canvas
		document.addEventListener('keydown', (event) => {
			if (event.key === 'r') {
				this.newGame()
			}
			if (event.key === ' ') {
				this.makeMove()
			}
		})

		// Resize canvas to fit the window when resized
		window.addEventListener('resize', () => {
			this.resizeCanvas()
		})
	}

	/**
	 * Toggles the selection of a card at the given index.
	 * @param {number} index - The index of the card to toggle.
	 */
	toggleSelectCard(index) {
		// Select a card at the given index
		if (index >= 0 && index < this.deckInPlay.getSize()) {
			if (this.selectedCards.includes(index)) {
				this.selectedCards = this.selectedCards.filter((card) => card !== index)
			} else {
				this.selectedCards.push(index)
			}
		}
	}

	/**
	 * Resizes the canvas to fit the window dimensions.
	 */
	resizeCanvas() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	/**
	 * Handles mouse click events on the canvas.
	 * @param {MouseEvent} event - The mouse event object.
	 */
	mouseClicked(event) {
		let x = event.x - this.canvas.offsetLeft + window.pageXOffset
		let y = event.y - this.canvas.offsetTop + window.pageYOffset

		for (let i = 0; i < this.deckInPlay.getSize(); i++) {
			let card = this.deckInPlay.getCard(i)

			if (card == null) {
				continue // Skip null cards
			}

			if (card.checkCollision(x, y)) {
				let selected = false
				for (let j = 0; j < this.selectedCards.length; j++) {
					if (this.selectedCards[j] === i) {
						selected = true
						break
					}
				}
				this.toggleSelectCard(i)
				break
			}
		}
	}

	/**
	 * Starts the game by initializing the canvas and dealing cards.
	 */
	start() {
		// Add event listeners for the buttons
		document.getElementById('resetButton').addEventListener('click', () => {
			game.newGame()
		})

		document.getElementById('confirmButton').addEventListener('click', () => {
			game.makeMove()
		})

		// Set the width and height of canvas
		this.resizeCanvas()

		// Start a new game
		this.newGame()
	}

	/**
	 * Draws the game elements on the canvas.
	 */
	draw() {
		// Clear the canvas and set the background color
		this.ctx.fillStyle = '#229922'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		// Draw background image if provided
		if (this.bg != null) {
			this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height)
		}

		// Draw the score at the top-left corner
		this.ctx.fillStyle = '#000000'
		this.ctx.font = '30px Arial'
		this.ctx.textAlign = 'left'
		this.ctx.fillText('Matches: ' + this.matches, 20, 40)

		// Define fixed spacing for 9 slots
		const spacing = 15
		const totalWidth =
			this.dipSize * this.imgWidth + (this.dipSize - 1) * spacing
		const startX = (this.canvas.width - totalWidth) / 2 // Center the slots horizontally
		const startY = this.canvas.height * 0.3 // Slightly above center

		// Draw each card in play, skipping nulls
		let visibleIndex = 0 // Track visible cards
		for (let i = 0; i < this.deckInPlay.getSize(); i++) {
			let card = this.deckInPlay.getCard(i)

			const slotX = startX + visibleIndex * (this.imgWidth + spacing)

			// Skip null cards but still increment visibleIndex
			// This allows for proper spacing of the cards
			if (card == null) {
				visibleIndex++
			} else {
				card.setPosition(Math.round(slotX), Math.round(startY))
				card.draw(this.ctx, this.selectedCards.includes(i))

				// Draw the card's index below itself
				this.ctx.fillStyle = '#000000'
				this.ctx.font = '20px Arial'
				this.ctx.textAlign = 'center'
				this.ctx.fillText(
					i + 1,
					Math.round(slotX + this.imgWidth / 2),
					Math.round(startY + this.imgHeight + 20)
				)

				visibleIndex++
			}
		}

		// Draw game over message if game is over
		if (this.gameOver == true) {
			// Create semi-transparent overlay
			this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

			// Draw message
			this.ctx.fillStyle = '#FFFFFF'
			this.ctx.font = 'bold 60px Arial'
			this.ctx.textAlign = 'center'
			this.ctx.textBaseline = 'middle'
			this.ctx.fillText(
				this.gameOverMessage,
				this.canvas.width / 2,
				this.canvas.height / 2
			)
		}
	}

	/**
	 * Checks if the player has won the game.
	 * @returns {boolean} True if the player has won, otherwise false.
	 */
	checkWin() {
		
		return this.deckInPlay.getSize() === 0 && this.deck.getSize() === 0
	}
	/**
	 * Processes the player's move and updates the game state.
	 */
	makeMove() {
		// Remove all selected cards from deckInPlay if the move is legal
		if (this.isLegal()) {
			// Replace each selected card from deckInPlay with a card from the deck
			for (let index of this.selectedCards) {
				this.discards.addCard(
					this.deckInPlay.replaceCard(this.deck.deal(), index)
				)
			}

			this.matches++
		}

		this.doWinCheck()

		// Deselect cards
		this.selectedCards = []
	}

	doWinCheck() {
		// Check if the game is over
		if (this.checkWin()) {
			this.doGameOver('You Win!')
		} else if (this.anotherPlayIsPossible()) {
			console.log('You have another play!')
		} else {
			this.doGameOver('You Lose!')
		}
	}

	/**
	 * Determines if the selected cards form a valid group for removal.
	 * @returns {boolean} True if the move is legal, otherwise false.
	 */
	isLegal() {
		// Determines if the selected cards form a valid group for removal
		// In Elevens, the legal groups are:
		for (let i = 0; i < this.selectedCards.length; i++) {
			if (this.selectedCards.length === 2) {
				// (1) a pair of non-face cards whose values add to 11
				return this.containsPairSum11()
			} else if (this.selectedCards.length === 3) {
				// (2) a group of three cards consisting of a jack, a queen, and a king in some order
				return this.containsJQK()
			}
		}

		return false
	}
	/**
	 * Checks if the selected cards contain a pair that sums to 11.
	 * @returns {boolean} True if a pair summing to 11 exists, otherwise false.
	 */
	containsPairSum11() {
		// Private function
		// INPUTS: none
		// OUTPUTS: true if the sum is 11, otherwise false
		// Only called if 2 elements are in selectedCards

		// Get the two cards from the deck
		let card1 = this.deckInPlay.getCard(this.selectedCards[0])
		let card2 = this.deckInPlay.getCard(this.selectedCards[1])

		// Check if the sum of the two cards is 11
		return card1.getValue() + card2.getValue() === 11
	}
	/**
	 * Checks if the selected cards contain a Jack, Queen, and King.
	 * @returns {boolean} True if the cards include J, Q, and K, otherwise false.
	 */
	containsJQK() {
		// Private function
		// INPUTS: none
		// OUTPUTS: true if the cards are J, Q, K in any order, false otherwise
		// Only called if selectedCards array has 3 elements

		// Get the three cards from the deck
		let card1 = this.deckInPlay.getCard(this.selectedCards[0])
		let card2 = this.deckInPlay.getCard(this.selectedCards[1])
		let card3 = this.deckInPlay.getCard(this.selectedCards[2])

		// Check if the cards are J, Q, K in any order
		let ranks = [card1.getRank(), card2.getRank(), card3.getRank()]
		return ranks.includes('J') && ranks.includes('Q') && ranks.includes('K')
	}

	/**
	 * Determines if another legal play is possible on the board.
	 * @returns {boolean} True if another play is possible, otherwise false.
	 */
	anotherPlayIsPossible() {
		// Determine if there are any legal plays left on the board
		// In Elevens, there is a legal play if the board contains:
		// (1) a pair of non-face cards whose values add to 11
		// (2) a group of three cards consisting of a jack, a queen, and a king in some order
		return (
			this.pairSum11Exists(this.deckInPlay) || this.JQKExists(this.deckInPlay)
		)
	}

	/**
	 * Checks if a pair of cards in the deck sums to 11.
	 * @param {Deck} dip - The deck in play.
	 * @returns {boolean} True if a pair summing to 11 exists, otherwise false.
	 */
	pairSum11Exists(dip) {
		// Private method
		// For each card in dip, see if another card exists that will make the sum 11
		// If you find a pair adding to 11, return true, otherwise return false
		for (let i = 0; i < dip.getSize(); i++) {
			let card1 = dip.getCard(i)
			if (card1 == null) {
				continue // Skip null cards
			}
			for (let j = i + 1; j < dip.getSize(); j++) {
				let card2 = dip.getCard(j)
				if (card2 == null) {
					continue // Skip null cards
				}
				if (card1.getValue() + card2.getValue() === 11) {
					return true
				}
			}
		}
		return false
	}

	/**
	 * Checks if the deck contains a Jack, Queen, and King.
	 * @param {Deck} deckInPlay - The deck in play.
	 * @returns {boolean} True if J, Q, and K exist, otherwise false.
	 */
	JQKExists(deckInPlay) {
		let foundJack = false
		let foundQueen = false
		let foundKing = false

		// Search through all of dip
		for (let i = 0; i < deckInPlay.getSize(); i++) {
			let card = deckInPlay.getCard(i)
			// Change the values of foundJack, foundQueen, and foundKing if the cards are found
			if (card.getRank() === 'J') {
				foundJack = true
			} else if (card.getRank() === 'Q') {
				foundQueen = true
			} else if (card.getRank() === 'K') {
				foundKing = true
			}
		}

		return foundJack && foundQueen && foundKing
	}
	/**
	 * Starts a new game by resetting the deck and dealing new cards.
	 */
	newGame() {
		// Move the current cards back into the deck
		while (this.deckInPlay.getSize() > 0) {
			this.deck.addCard(this.deckInPlay.deal())
		}
		while (this.discards.getSize() > 0) {
			this.deck.addCard(this.discards.deal())
		}

		// Unselect all cards
		this.selectedCards = []

		// Reset the score
		this.matches = 0

		// Reset game over state
		this.gameOver = false
		this.gameOverMessage = ''

		// Shuffle the deck
		// this.deck.shuffle()

		// Deal new cards based on the dip size
		for (let i = 0; i < this.dipSize; i++) {
			this.dealCard()
		}

		// Check if the game is over on first deal :(
		this.doWinCheck()
	}

	/**
	 * Deals a card from the deck and adds it to the deckInPlay.
	 */
	dealCard() {
		// Deal a card from the deck and add it to the deckInPlay

		this.deckInPlay.addCard(this.deck.deal())
	}

	/**
	 * Removes all cards from the deck and adds them to the discards.
	 */
	emptyDeck() {
		// Remove all cards from the deck
		while (!this.deck.isEmpty()) {
			this.discards.addCard(this.deck.deal())
		}
	}

	/**
	 * Sets the game over state and displays a message.
	 * @param {string} message - The message to display.
	 */
	doGameOver(message) {
		this.gameOver = true
		this.gameOverMessage = message
	}
}
