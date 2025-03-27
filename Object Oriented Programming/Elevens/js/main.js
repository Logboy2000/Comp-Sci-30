let canvas, game, card
var cardsSpritesheet = new Image()
cardsSpritesheet.src = 'img/cardsSpriteSheet.png'

window.onload = loaded

function loaded() {
    canvas = document.getElementById('gameCanvas')
	while (!cardsSpritesheet.complete) {
		//wait
	}

    const cardW = cardsSpritesheet.width / 13
    const cardH = cardsSpritesheet.height / 8


	let gameDeckCards = []
	const suits = ['hearts', 'diamonds', 'clubs', 'spades']
	const ranks = [
		{ rank: 'A', value: 1 },
		{ rank: '2', value: 2 },
		{ rank: '3', value: 3 },
		{ rank: '4', value: 4 },
		{ rank: '5', value: 5 },
		{ rank: '6', value: 6 },
		{ rank: '7', value: 7 },
		{ rank: '8', value: 8 },
		{ rank: '9', value: 9 },
		{ rank: '10', value: 10 },
		{ rank: 'J', value: 0 },
		{ rank: 'Q', value: 0 },
		{ rank: 'K', value: 0 },
	]

	for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
		for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
			const rank = ranks[rankIndex]
			const suit = suits[suitIndex]

			// Assuming sheetX, sheetY, sheetSelectedX, sheetSelectedY are calculated based on rankIndex and suitIndex
			const sheetX = rankIndex * cardW // Example: 72px per card width
			const sheetY = suitIndex * cardH // Example: 96px per card height
			const sheetSelectedX = sheetX // Example offset for selected state
			const sheetSelectedY = sheetY + 388 // Example offset for selected state

			gameDeckCards.push(
				new Card(
					rank.rank,
					suit,
					rank.value,
					sheetX,
					sheetY,
					sheetSelectedX,
					sheetSelectedY,
					cardsSpritesheet
				)
			)
		}
	}

	game = new ElevensGame(
		canvas,
		new Deck(gameDeckCards)
	)

	game.start()
	update()
}

function update() {
	game.draw()
	requestAnimationFrame(update)
}
