// elevens class
var Elevens = function (canvasID, deck) {
	var width = 800
	var height = 300
	canvas = document.getElementById(canvasID)
	ctx = canvas.getContext('2d')
	this.score = 0
	deck = deck
	cardLocations = new Array()
	var cip = new Array() // empty array to create the dip ... never used again
	var dip = new Deck(cip)
	var selectedCards = new Array()
	var imgWidth = 73

	canvas.addEventListener('mousedown', getPosition, false)

	function getPosition(event) {
		var x = event.x
		var y = event.y

		x -= canvas.offsetLeft
		y -= canvas.offsetTop

		// adjust for any scrolling
		clickx += window.pageXOffset
		clicky += window.pageYOffset

		//alert("x:" + x + " y:" + y);
		// need to see if a card was clicked

		if (y <= 150 && y >= 50) {
			// clicked in card region
			clicked = false
			for (i = 0; i < 9; i++) {
				// was a card was clicked or and which one was it (could have click in the gap)
				if (
					x >= 20 + i * 20 + i * imgWidth &&
					x <= 20 + i * 20 + i * imgWidth + imgWidth
				) {
					// i+1 becasue we need the end point not start point
					//card i was clicked ... is it already selected?
					// look in selectedCards for i
					for (j = 0; j < selectedCards.length; j++) {
						if (selectedCards[j] == i) {
							selected = true
							break // exit this for look
						}
					}
					//I now know if the current card was already selected or not - based on selected variable
					if (selected) {
						//card needs to be removed from selectedCards
						/*
						//remove the element at position j from the selectedCards array

						*/
					} else {
						// card is not currently selected ... add to SelectedCards
						//your code here
					}
					// draw the card
					//x position will be i*(imgWidth+20) + 20
					//y positoin will be 50

					return // you already found the clicked on card.  no need to continue with the remainder of the for loop
				}
			}
		}
	} // end of GetPosition

	this.setup = function () {
		/*
			Privledged method to start the game
			set the width and height of canvas
			draw a green rectangle to be the board
			shuffle the cards
			ensure their are no elements in the SelectedCards array
			deal out 9 cards
				this means 9 cards will be removed from deck and added to dip
				draw each of the cards in dip on the elevens board 
			
		*/
	} // end of Setup

	this.checkWin = function () {
		/* priviledged method to determin if you have won
			INPUTS 
				none
			OUTPUTS
				boolean value if you won ... true if you win
		*/
	} // end of checkWin
	this.makeMove = function () {
		/*
			This remove all selelcted cards replaces them with new cards from the deck if cards still exist
			Don't forget to draw an image for the new cards.  If no new cards exist draw a green rectangel on top of the old image
			don't forget to ensure that the SelectedCatds array has no values at the end of this method
			This method should only be called if the move has already been validated as being legal
			
			Should this be a privildedged method or a private funciton???
		*/
	} // end of makeMove

	this.isLegal = function () {
		// {// start of isLegal
		/**
	 * Determines if the selected cards form a valid group for removal.
	 * In Elevens, the legal groups are (1) a pair of non-face cards
	 * whose values add to 11, and (2) a group of three cards consisting of
	 * a jack, a queen, and a king in some order.
	 * INPUTS
	 	NONE
	 * OUTPUTS
	 	 true if the selected cards form a valid group for removal;
	 *         false otherwise.
	 */
	} // end of isLegal

	function containsPairSum11() {
		/* Private function 
		inputs 
			none
		outputs
			true if the sum is 11 otherwise false
		only called if 2 elements are in selectedCards.  Determines if the two selected cards add up to 11
		*/
	} // end of containsPairSum11

	function containsJQK() {
		/* PRIVATE FUNCTION
		inputs
			none
		outputs
			true if the cards are J,Q,K in any order
			false otherwise
		only called if selectedCards array has 3 elements.  Checks if those elements reference a J, Q and K
		*/
		// make sure  there is one each of Jack, Queen & king
		// total value must be 0 or not all face cards
	} // end of containsJQK

	this.anotherPlayIsPossible = function () {
		// start of public method anotherPlayIsPossible
		/**
		 * Determine if there are any legal plays left on the board.
		 * In Elevens, there is a legal play if the board contains
		 * (1) a pair of non-face cards whose values add to 11, or (2) a group
		 * of three cards consisting of a jack, a queen, and a king in some order.
		 * @return true if there is a legal play left on the board;
		 *         false otherwise.
		 * inputs:
		 	none
			outputs:
				boolean -- true = another play is possible
						-- false = another play is not possible
		 */
		//List<Integer> cIndexes = cardIndexes();
		return pairSum11Exists(dip) || JQKExists(dip)
	} // end of anotherPlayIsPossible

	/**
	 * Check for an 11-pair in the selected cards.
	 * @param selectedCards selects a subset of this board.  It is list
	 *                      of indexes into this board that are searched
	 *                      to find an 11-pair.
	 * @return true if the board entries in selectedCards
	 *              contain an 11-pair; false otherwise.
	 */
	function pairSum11Exists(dip) {
		// start of PairSum11Exists
		/*
			private boolean method containsPairSum11
			for each card in dip, see if another card exists that will make the sum 11
			if you find a pair adding to 11, return true, otherwise return false
		*/
	} // end of PairSum11Exists

	function JQKExists(dip) {
		// private boolean method containsJQK starts
		/**
		 * Check for a JQK in the selected cards.
		 * @param SelectedCards selects a subset of this board.  It is list
		 *                      of indexes into this board that are searched
		 *                      to find a JQK group.
		 * @return true if the board entries in SelectedCards
		 *              include a jack, a queen, and a king; false otherwise.
		 */
		var foundJack = false
		var foundQueen = false
		var foundKing = false

		/*
			your Code goes here ... search for all of dip.
			change the values of foundJack, foundQueen and foundKing if the cards are found
		*/

		return foundJack && foundQueen && foundKing
	} // end of JQKExists

	this.emptyDeck = function () {
		/*
			NOT FOR GAME PLAY ... FOR TESTING PURPOSES
			removes all cards from main deck
			
		*/

		while (!deck.isEmpty()) {
			deck.removeCard(0)
		}
		alert('Number of cards in deck is ' + deck.getSize())
	} //end of emptyDeck
} // end of elevens constructor
