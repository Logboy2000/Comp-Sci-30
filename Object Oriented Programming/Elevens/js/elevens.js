var i = 0

class ElevensGame {
	constructor(canvas, deck) {
		this.canvas = canvas
		this.ctx = this.canvas.getContext('2d')
		this.score = 0
		this.deck = deck

		this.cardsInPlay = []
		this.selectedCards = []

		this.imgWidth = 73
		this.imgHeight = 97

		this.restartButton = new CanvasButton(0, 0, 130, 50, 'Restart Game', () => {
			this.newGame()
		})

		this.canvas.addEventListener(
			'mousedown',
			this.mouseClicked.bind(this),
			false
		)

		// Resize canvas to fit the window when resized
		window.addEventListener('resize', () => {
			this.resizeCanvas()
		})
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	mouseClicked(event) {
		let x = event.x - this.canvas.offsetLeft + window.pageXOffset
		let y = event.y - this.canvas.offsetTop + window.pageYOffset

		for (let i = 0; i < this.cardsInPlay.length; i++) {
			let card = this.cardsInPlay[i]
			if (card.checkCollision(x, y)) {
				let selected = false
				for (let j = 0; j < this.selectedCards.length; j++) {
					if (this.selectedCards[j] === i) {
						selected = true
						break
					}
				}

				if (selected) {
					// Remove the card from selectedCards
					this.selectedCards = this.selectedCards.filter((card) => card !== i)
				} else {
					// Add the card to selectedCards
					this.selectedCards.push(i)
				}

				break
			}
		}

		this.restartButton.handleClick(x, y)
	}

	// Privileged method to start the game
	setup() {
		// Set the width and height of canvas
		this.resizeCanvas()

		this.newGame()
	}

	draw() {
		this.ctx.fillStyle = '#229922'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.ctx.fillStyle = '#000000'
		this.ctx.font = '30px Arial'
		this.ctx.textAlign = 'left'
		this.ctx.fillText('Score: ' + this.score, 10, 30)

		// Calculate the total width of all cards and spacing
		let totalWidth =
			this.cardsInPlay.length * this.imgWidth +
			(this.cardsInPlay.length - 1) * 10
		let startX = (this.canvas.width - totalWidth) / 2 // Center the cards horizontally
		let startY = (this.canvas.height - this.imgHeight) / 2 // Center the cards vertically

		for (let i = 0; i < this.cardsInPlay.length; i++) {
			let card = this.cardsInPlay[i]
			card.setPosition(
				Math.round(startX + i * (this.imgWidth + 10)),
				Math.round(startY)
			)

			// Draw the card image
			if (this.selectedCards.includes(i)) {
				card.draw(this.ctx, true)
			} else {
				card.draw(this.ctx, false)
			}
		}
		this.restartButton.setPosition(
			(this.canvas.width / 2) - (this.restartButton.width/2),
			startY + 120
		)
		this.restartButton.draw(this.ctx)
	}

	checkWin() {
		// Privileged method to determine if you have won
		// INPUTS: none
		// OUTPUTS: boolean value if you won ... true if you win
	}

	makeMove() {
		// Remove all selected cards, replace them with new cards from the deck if cards still exist
		// Draw an image for the new cards or a green rectangle if no new cards exist
		// Ensure the selectedCards array has no values at the end of this method
	}

	isLegal() {
		// Determines if the selected cards form a valid group for removal
		// In Elevens, the legal groups are:
		// (1) a pair of non-face cards whose values add to 11
		// (2) a group of three cards consisting of a jack, a queen, and a king in some order
	}

	containsPairSum11() {
		// Private function
		// INPUTS: none
		// OUTPUTS: true if the sum is 11, otherwise false
		// Only called if 2 elements are in selectedCards
	}

	containsJQK() {
		// Private function
		// INPUTS: none
		// OUTPUTS: true if the cards are J, Q, K in any order, false otherwise
		// Only called if selectedCards array has 3 elements
	}

	anotherPlayIsPossible() {
		// Determine if there are any legal plays left on the board
		// In Elevens, there is a legal play if the board contains:
		// (1) a pair of non-face cards whose values add to 11
		// (2) a group of three cards consisting of a jack, a queen, and a king in some order
		return this.pairSum11Exists(this.deck) || this.JQKExists(this.deck)
	}

	pairSum11Exists(dip) {
		// Private method
		// For each card in dip, see if another card exists that will make the sum 11
		// If you find a pair adding to 11, return true, otherwise return false
	}

	JQKExists(dip) {
		let foundJack = false
		let foundQueen = false
		let foundKing = false

		// Search for all of dip
		// Change the values of foundJack, foundQueen, and foundKing if the cards are found

		return foundJack && foundQueen && foundKing
	}

	newGame() {
		// Move the current cards back into the deck
		while (this.cardsInPlay.length > 0) {
			this.deck.addCard(this.cardsInPlay.pop())
		}

		// Unselect all cards
		this.selectedCards = []

		// Reset the score
		this.score = 0

		// Shuffle the deck
		this.deck.shuffle()

		// Deal 9 new cards
		for (let i = 0; i < 9; i++) {
			this.cardsInPlay.push(this.deck.deal())
		}
	}

	emptyDeck() {
		// NOT FOR GAME PLAY ... FOR TESTING PURPOSES
		// Removes all cards from the main deck
		while (!this.deck.isEmpty()) {
			this.deck.removeCard(0)
		}
		alert('Number of cards in deck is ' + this.deck.getSize())
	}
}
