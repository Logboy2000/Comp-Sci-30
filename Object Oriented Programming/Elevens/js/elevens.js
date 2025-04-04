class ElevensGame {
	constructor(canvas, deck) {
		this.canvas = canvas
		this.ctx = this.canvas.getContext('2d')
		this.matches = 0
		this.deck = deck

		this.deckInPlay = new Deck()
		this.discards = new Deck()

		this.selectedCards = []
		this.buttons = []

		this.imgWidth = 73
		this.imgHeight = 97

		this.buttons.push(
			new CanvasButton(0, 0, 130, 50, 'Restart Game', () => {
				this.newGame()
			}),
			new CanvasButton(0, 0, 130, 50, 'Confirm Move', () => {
				this.makeMove()
			})
		)

		this.canvas.addEventListener(
			'mousedown',
			this.mouseClicked.bind(this),
			false
		)

		document.addEventListener('keydown', (event) => {
			if (event.key === 'r') {
				this.newGame()
			}
			if (event.key === ' ') {
				this.makeMove()
			}
			if (event.key === '1') {
				this.toggleSelectCard(0)
			}
			if (event.key === '2') {
				this.toggleSelectCard(1)
			}
			if (event.key === '3') {
				this.toggleSelectCard(2)
			}
			if (event.key === '4') {
				this.toggleSelectCard(3)
			}
			if (event.key === '5') {
				this.toggleSelectCard(4)
			}
			if (event.key === '6') {
				this.toggleSelectCard(5)
			}
			if (event.key === '7') {
				this.toggleSelectCard(6)
			}
			if (event.key === '8') {
				this.toggleSelectCard(7)
			}
			if (event.key === '9') {
				this.toggleSelectCard(8)
			}
		})

		// Resize canvas to fit the window when resized
		window.addEventListener('resize', () => {
			this.resizeCanvas()
		})
	}

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

	resizeCanvas() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	mouseClicked(event) {
		let x = event.x - this.canvas.offsetLeft + window.pageXOffset
		let y = event.y - this.canvas.offsetTop + window.pageYOffset

		for (let i = 0; i < this.deckInPlay.getSize(); i++) {
			let card = this.deckInPlay.getCard(i)
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

		for (let button of this.buttons) {
			button.handleClick(x, y)
		}
	}

	// Privileged method to start the game
	start() {
		// Set the width and height of canvas
		this.resizeCanvas()

		// Start a new game
		this.newGame()
	}

	draw() {
		// Clear the canvas and set the background color
		this.ctx.fillStyle = '#229922'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		// Draw the score at the top-left corner
		this.ctx.fillStyle = '#000000'
		this.ctx.font = '30px Arial'
		this.ctx.textAlign = 'left'
		this.ctx.fillText('Matches: ' + this.matches, 20, 40)

		// Calculate the total width of all cards and spacing
		let totalWidth =
			this.deckInPlay.getSize() * this.imgWidth +
			(this.deckInPlay.getSize() - 1) * 15 // Adjusted spacing for better alignment
		let startX = (this.canvas.width - totalWidth) / 2 // Center the cards horizontally
		let startY = this.canvas.height * 0.3 // Position cards slightly above center

		// Draw each card in play
		for (let i = 0; i < this.deckInPlay.getSize(); i++) {
			let card = this.deckInPlay.getCard(i)
			card.setPosition(
				Math.round(startX + i * (this.imgWidth + 15)),
				Math.round(startY)
			)
			card.draw(this.ctx, this.selectedCards.includes(i))
			// Draw the card's index below itself
			this.ctx.fillStyle = '#000000'
			this.ctx.font = '20px Arial'
			this.ctx.textAlign = 'center'
			this.ctx.fillText(
				i + 1,
				Math.round(startX + i * (this.imgWidth + 15) + this.imgWidth / 2),
				Math.round(startY + this.imgHeight + 20)
			)
		}

		// Calculate button area and position buttons below the cards
		startY = this.canvas.height * 0.7 // Position buttons below cards

		for (let i = 0; i < this.buttons.length; i++) {
			let buttonX = (this.canvas.width - this.buttons[i].width) / 2
			let buttonY = startY + i * (60 + 15) // Adjusted button spacing
			this.buttons[i].setPosition(buttonX, buttonY)
			this.buttons[i].draw(this.ctx)
		}
	}

	checkWin() {
		// Privileged method to determine if you have won
		// INPUTS: none
		// OUTPUTS: boolean value if you won ... true if you win
		return this.deckInPlay.getSize() === 0 && this.deck.getSize() === 0
	}

	makeMove() {
		// Remove all selected cards from deckInPlay if the move is legal
		if (this.isLegal()) {
			// Sort selectedCards in descending order to avoid index shifting issues
			this.selectedCards.sort((a, b) => b - a)

			// Remove each selected card from deckInPlay
			for (let index of this.selectedCards) {
				this.discards.addCard(this.deckInPlay.removeCard(index))
			}

			this.matches++
		}

		// Deal new cards to replace the removed cards
		for (let i = this.deckInPlay.getSize(); i < 9; i++) {
			if (this.deck.getSize() === 0) {
				console.log('No more cards in the deck!')
				break
			} else {
				this.deckInPlay.addCard(this.deck.deal())
			}
		}

		// Check if the game is over
		if (this.checkWin()) {
			console.log('You Win!')
			alert('You Win!')
		} else if (this.anotherPlayIsPossible()) {
			console.log('You have another play!')
		} else {
			console.log('You Lose!')
			alert('You Lose!')
		}

		// Deselect cards
		this.selectedCards = []
	}

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

	anotherPlayIsPossible() {
		// Determine if there are any legal plays left on the board
		// In Elevens, there is a legal play if the board contains:
		// (1) a pair of non-face cards whose values add to 11
		// (2) a group of three cards consisting of a jack, a queen, and a king in some order
		return (
			this.pairSum11Exists(this.deckInPlay) || this.JQKExists(this.deckInPlay)
		)
	}

	pairSum11Exists(dip) {
		// Private method
		// For each card in dip, see if another card exists that will make the sum 11
		// If you find a pair adding to 11, return true, otherwise return false
		for (let i = 0; i < dip.getSize(); i++) {
			let card1 = dip.getCard(i)
			for (let j = i + 1; j < dip.getSize(); j++) {
				let card2 = dip.getCard(j)
				if (card1.getValue() + card2.getValue() === 11) {
					return true
				}
			}
		}
		return false
	}

	JQKExists(deckInPlay) {
		let foundJack = false
		let foundQueen = false
		let foundKing = false

		// Search for all of dip
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

		// Shuffle the deck
		this.deck.shuffle()

		// Deal 9 new cards
		for (let i = 0; i < 9; i++) {
			this.deckInPlay.addCard(this.deck.deal())
		}
	}

	emptyDeck() {
		// NOT FOR GAME PLAY ... FOR TESTING PURPOSES
		// Removes all cards from the main deck
		while (!this.deck.isEmpty()) {
			this.deck.removeCard(0)
		}
		console.log('Number of cards in deck is ' + this.deck.getSize())
	}
}
