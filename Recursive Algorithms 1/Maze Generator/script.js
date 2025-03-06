/// global stuff thats set after load
let canvas,
	ctx,
	columnInput,
	rowInput,
	cellSizeInput,
	mazeGenButtonI,
	mazeGenButtonR,
	animationDelayInput,
	showStepsToggle,
	weightUpInput,
	weightDownInput,
	weightLeftInput,
	weightRightInput

//// Settings
// Maze Dimensions
let cellSize = 10
let mazeCols = 50
let mazeRows = 40

// Animation
let animationDelay = 0
let showSteps = false

// Colors
let visitedColor = '#5555DD'
let finishedColor = '#555555'
let currentCellColor = '#FFD700'

let visitedOutlineColor = '#0000FF'
let finishedOutlineColor = '#000000'
let currentCellOutlineColor = '#FF0000'

// Assign weights to each direction
let directionWeights = {
	up: 0,
	down: 1,
	left: 1,
	right: 1,
}

/// Maze Gen
let mazeArr = []
let affectedCells = []
let mazeGenerationActive = false
let stopRequested = false

function getElement(id) {
	return document.getElementById(id)
}

function loaded() {
	canvas = getElement('maze')
	ctx = canvas.getContext('2d')
	ctx.imageSmoothingEnabled = false

	columnInput = getElement('columnInput')
	rowInput = getElement('rowInput')
	cellSizeInput = getElement('cellSizeInput')
	mazeGenButtonI = getElement('mazeGenButtonI')
	mazeGenButtonR = getElement('mazeGenButtonR')
	animationDelayInput = getElement('animationDelayInput')
	showStepsToggle = getElement('showStepsToggle')
	weightUpInput = getElement('weightUpInput')
	weightDownInput = getElement('weightDownInput')
	weightLeftInput = getElement('weightLeftInput')
	weightRightInput = getElement('weightRightInput')

	mazeGenButtonI.addEventListener('click', () => genButtonPressed(false))
	mazeGenButtonR.addEventListener('click', () => genButtonPressed(true))
}

function genButtonPressed(doRecursively) {
	// Stop any currently running maze
	stopRequested = true 

	// Wait a short moment to allow the previous loop to exit
	setTimeout(() => {
		// Reset stop request
		stopRequested = false

		// Prevent starting a new maze if one is already running
		if (mazeGenerationActive) return

		mazeRows = parseInt(rowInput.value)
		mazeCols = parseInt(columnInput.value)
		cellSize = parseInt(cellSizeInput.value)
		animationDelay = parseInt(animationDelayInput.value)
		showSteps = showStepsToggle.checked

		if (mazeRows <= 0 || mazeCols <= 0 || cellSize <= 0) {
			alert('Maze dimensions and cell size must be greater than 0!')
			return
		}

		directionWeights = {
			up: parseInt(weightUpInput.value),
			down: parseInt(weightDownInput.value),
			left: parseInt(weightLeftInput.value),
			right: parseInt(weightRightInput.value),
		}

		canvas.width = mazeCols * cellSize
		canvas.height = mazeRows * cellSize
		ctx.fillStyle = '#FFF'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		// Reset maze array
		mazeArr = []
		for (let y = 0; y < mazeRows; y++) {
			mazeArr[y] = []
			for (let x = 0; x < mazeCols; x++) {
				mazeArr[y].push(new MazeCell(x, y))
			}
		}

		affectedCells = []
		mazeGenerationActive = true
		let startTime = performance.now()

		if (doRecursively) {
			mazeGenButtonR.innerText = 'STOP'
			makeRecursiveMaze(mazeArr, 0, 0).then(() => {
				mazeGenerationActive = false
				mazeGenButtonR.innerText = 'Recursion Maze'
				console.log(`Recursion Time: ${(performance.now() - startTime).toFixed(2)} ms`)
			})
		} else {
			mazeGenButtonI.innerText = 'STOP'
			makeIterativeMaze(mazeArr, 0, 0).then(() => {
				mazeGenerationActive = false
				mazeGenButtonI.innerText = 'Iterative Maze!'
				console.log(`Iterative Time: ${(performance.now() - startTime).toFixed(2)} ms`)
			})
		}
	}, 50) // Small delay to let the previous function exit
}


async function makeIterativeMaze(arr, startX, startY) {
	let stack = []
	let currentCell = arr[startY][startX]
	currentCell.visited = true

	while (true) {
		if (stopRequested) return

		if (showSteps) affectedCells = []
		affectedCells.push(currentCell)

		let nextCell = currentCell.getRandomValidNeighbor()
		if (nextCell) {
			removeWalls(currentCell, nextCell)
			stack.push(currentCell)
			currentCell = nextCell
			currentCell.visited = true
			affectedCells.push(currentCell)
		} else if (stack.length > 0) {
			currentCell.backtracked = true
			affectedCells.push(currentCell)
			currentCell = stack.pop()
		} else {
			currentCell.backtracked = true
			affectedCells.push(currentCell)
			break
		}

		if (showSteps) {
			drawMazeCells(affectedCells, currentCell)
			await new Promise((resolve) => setTimeout(resolve, animationDelay))
		}
	}

	drawMazeCells(affectedCells, null)
}

async function makeRecursiveMaze(arr, x, y) {
	if (stopRequested) return

	let currentCell = arr[y][x]
	currentCell.visited = true
	affectedCells.push(currentCell)

	if (showSteps) {
		drawMazeCells(affectedCells, currentCell)
		await new Promise((resolve) => setTimeout(resolve, animationDelay))
	}

	let neighbors = currentCell.getValidNeighbors()
	for (let nextCell of neighbors) {
		if (!nextCell.visited) {
			removeWalls(currentCell, nextCell)
			affectedCells.push(nextCell)

			if (showSteps) {
				drawMazeCells(affectedCells, currentCell)
				await new Promise((resolve) => setTimeout(resolve, animationDelay))
			}

			await makeRecursiveMaze(arr, nextCell.x, nextCell.y)
		}
	}

	currentCell.backtracked = true
	affectedCells.push(currentCell)

	if (showSteps || stopRequested) {
		drawMazeCells(affectedCells, currentCell)
		await new Promise((resolve) => setTimeout(resolve, animationDelay))
	} else if (!showSteps && x === 0 && y === 0) {
		drawMazeCells(affectedCells, null)
	}
}

function drawMazeCells(affectedCells, currentCell) {
	for (let cell of affectedCells) {
		if (cell === currentCell) {
			ctx.fillStyle = currentCellColor
			ctx.strokeStyle = currentCellOutlineColor
		} else if (cell.backtracked) {
			ctx.fillStyle = finishedColor
			ctx.strokeStyle = finishedOutlineColor
		} else if (cell.visited) {
			ctx.fillStyle = visitedColor
			ctx.strokeStyle = visitedOutlineColor
		}

		drawCellBackground(cell)
		drawCellWalls(cell)
	}
}


function drawCellBackground(cell) {
	ctx.fillRect(cell.drawX, cell.drawY, cellSize, cellSize)
}

function drawCellWalls(cell) {
	const inset = 0.0
	// up
	if (cell.walls[0]) {
		drawLine(
			ctx,
			cell.drawX + cellSize * inset,
			cell.drawY + cellSize * inset,
			cell.drawX + cellSize * (1 - inset),
			cell.drawY + cellSize * inset
		)
	}
	// right
	if (cell.walls[1]) {
		drawLine(
			ctx,
			cell.drawX + cellSize * (1 - inset),
			cell.drawY + cellSize * inset,
			cell.drawX + cellSize * (1 - inset),
			cell.drawY + cellSize * (1 - inset)
		)
	}
	// down
	if (cell.walls[2]) {
		drawLine(
			ctx,
			cell.drawX + cellSize * inset,
			cell.drawY + cellSize * (1 - inset),
			cell.drawX + cellSize * (1 - inset),
			cell.drawY + cellSize * (1 - inset)
		)
	}
	// left
	if (cell.walls[3]) {
		drawLine(
			ctx,
			cell.drawX + cellSize * inset,
			cell.drawY + cellSize * inset,
			cell.drawX + cellSize * inset,
			cell.drawY + cellSize * (1 - inset)
		)
	}
}

class MazeCell {
	constructor(x = 0, y = 0) {
		this.visited = false
		this.backtracked = false
		this.walls = [true, true, true, true] // [Up, Right, Down, Left]
		this.x = x
		this.y = y
		this.drawX = this.x * cellSize
		this.drawY = this.y * cellSize
	}

	getRandomValidNeighbor() {
		let neighbors = []

		let up = mazeArr[this.y - 1] && mazeArr[this.y - 1][this.x] // up
		let down = mazeArr[this.y + 1] && mazeArr[this.y + 1][this.x] // down
		let left = mazeArr[this.y][this.x - 1] // left
		let right = mazeArr[this.y][this.x + 1] // right

		// Check if each neighbor is valid and push with its weight
		if (up && !up.visited) {
			for (let i = 0; i < directionWeights.up; i++) {
				neighbors.push(up)
			}
		}
		if (down && !down.visited) {
			for (let i = 0; i < directionWeights.down; i++) {
				neighbors.push(down)
			}
		}
		if (left && !left.visited) {
			for (let i = 0; i < directionWeights.left; i++) {
				neighbors.push(left)
			}
		}
		if (right && !right.visited) {
			for (let i = 0; i < directionWeights.right; i++) {
				neighbors.push(right)
			}
		}

		// Return a weighted random neighbor
		if (neighbors.length > 0) {
			return neighbors[randomRangeInt(0, neighbors.length - 1)]
		}
		return null // No valid neighbor found
	}
	getValidNeighbors() {
		let neighbors = []

		let up = mazeArr[this.y - 1] && mazeArr[this.y - 1][this.x] // Up
		let down = mazeArr[this.y + 1] && mazeArr[this.y + 1][this.x] // Down
		let left = mazeArr[this.y][this.x - 1] // Left
		let right = mazeArr[this.y][this.x + 1] // Right

		// Check if each neighbor is valid and push with its weight
		if (up && !up.visited) {
			for (let i = 0; i < directionWeights.up; i++) {
				neighbors.push(up)
			}
		}
		if (down && !down.visited) {
			for (let i = 0; i < directionWeights.down; i++) {
				neighbors.push(down)
			}
		}
		if (left && !left.visited) {
			for (let i = 0; i < directionWeights.left; i++) {
				neighbors.push(left)
			}
		}
		if (right && !right.visited) {
			for (let i = 0; i < directionWeights.right; i++) {
				neighbors.push(right)
			}
		}

		// Shuffle the array to ensure randomness in traversal order
		return neighbors.sort(() => Math.random() - 0.5)
	}
}

function removeWalls(current, next) {
	let x = current.x - next.x
	let y = current.y - next.y

	if (x === 1) {
		current.walls[3] = false
		next.walls[1] = false
	} else if (x === -1) {
		current.walls[1] = false
		next.walls[3] = false
	}

	if (y === 1) {
		current.walls[0] = false
		next.walls[2] = false
	} else if (y === -1) {
		current.walls[2] = false
		next.walls[0] = false
	}
}

function drawLine(ctx, x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.lineWidth = Math.round(cellSize / 10)
	ctx.stroke()
}

function randomRangeInt(min, max) {
	if (min == max) {
		return min
	}
	return Math.floor(Math.random() * (max - min + 1) + min)
}
