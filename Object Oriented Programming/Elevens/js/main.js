let canvas, game, card
let cardsSpritesheet = new Image()
cardsSpritesheet.src = 'img/cardsSpriteSheet.png'
let bg = new Image()
bg.src = 'img/bg.jpg'

window.onload = htmlLoaded

function htmlLoaded() {
	canvas = document.getElementById('gameCanvas')
	const ctx = canvas.getContext('2d')

	// Draw loading text
	ctx.fillStyle = '#000000'
	ctx.font = '30px Arial'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2)

	// Wait for resources to load properly
	if (cardsSpritesheet.complete && bg.complete) {
		resourcesLoaded()
	} else {
		let loadedCount = 0
		const totalResources = 2

		function checkAllLoaded() {
			loadedCount++
			if (loadedCount === totalResources) {
				resourcesLoaded() 
			}
		}

		cardsSpritesheet.onload = checkAllLoaded
		bg.onload = checkAllLoaded
	}
}

function resourcesLoaded() {
	const settingsButton = document.getElementById('settingsButton')
	const settingsPanel = document.getElementById('settingsPanel')
	const closeSettingsButton = document.getElementById('closeSettingsButton')
	const applySettingsButton = document.getElementById('applySettingsButton')

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

			const sheetX = rankIndex * cardW
			const sheetY = suitIndex * cardH
			const sheetSelectedX = sheetX
			const sheetSelectedY = sheetY + 388

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

	game = new ElevensGame(canvas, new Deck(gameDeckCards), 9, bg)

	game.start()

	settingsButton.addEventListener('click', () => {
		settingsPanel.classList.toggle('open')
	})

	closeSettingsButton.addEventListener('click', () => {
		settingsPanel.classList.remove('open')
	})

	applySettingsButton.addEventListener('click', () => {
		applySettings()
		settingsPanel.classList.remove('open')
	})

	console.log('game loaded!')
	update()
}

function update() {
	game.draw()
	requestAnimationFrame(update)
}

function applySettings() {
	const newSize = parseInt(document.getElementById('deckSize').value, 10)
	if (!isNaN(newSize) && newSize >= 1 && newSize <= 52) {
		// Update the game with the new deck size
		game.dipSize = newSize
	}

	game.newGame()
}
