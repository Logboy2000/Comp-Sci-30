/// global stuff thats set after load
let canvas,
	ctx,
	columnInput,
	rowInput,
	cellSizeInput,
	mazeGenButton,
	animationDelayInput,
	showStepsToggle

//// Settings
// Maze Dimensions
let cellSize = 10
let mazeCols = 50
let mazeRows = 40

// Animation
let animationDelay = 0
let showSteps = false

// Colors
let visitedColor = '#0000DD'
let finishedColor = '#555555'
let currentCellColor = '#FFD700'

let visitedOutlineColor = '#0000FF'
let finishedOutlineColor = '#000000'
let currentCellOutlineColor = '#FF0000'

/// Maze Gen
let mazeArr = []
let affectedCells = [] // Add the current cell to the affected array
let mazeGenerationActive = false // Tracks if a maze is being generated
let mazeTimeout // Store the timeout so we can cancel it
let currentCell = null

function getElement(id) {
	return document.getElementById(id)
}

function loaded() {
	canvas = document.getElementById('maze')
	ctx = canvas.getContext('2d')
	ctx.imageSmoothingEnabled = false

	columnInput = getElement('columnInput')
	rowInput = getElement('rowInput')
	cellSizeInput = getElement('cellSizeInput')
	mazeGenButton = getElement('mazeGenButton')
	animationDelayInput = getElement('animationDelayInput')
	showStepsToggle = getElement('showStepsToggle')

	mazeGenButton.addEventListener('click', function () {
		if (mazeGenerationActive) {
			// Stop old gen before starting a new maze
			clearTimeout(mazeTimeout)
			mazeGenerationActive = false
		}

		mazeRows = rowInput.value
		mazeCols = columnInput.value
		cellSize = cellSizeInput.value
		animationDelay = animationDelayInput.value
		showSteps = showStepsToggle.checked

		if (mazeRows <= 0) {
			alert('Maze must have more than 0 rows!')
			return
		}
		if (mazeCols <= 0) {
			alert('Maze must have more than 0 columns!')
			return
		}
		if (cellSize <= 0) {
			alert('Cell size must be greater than 0!')
			return
		}

		canvas.width = mazeCols * cellSize
		canvas.height = mazeRows * cellSize

		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		mazeArr = []

		for (let y = 0; y < mazeRows; y++) {
			mazeArr[y] = []
			for (let x = 0; x < mazeCols; x++) {
				const newCell = new MazeCell(x, y)
				mazeArr[y].push(newCell)
			}
		}
		affectedCells = []
		mazeGenerationActive = true // Set flag to prevent multiple generations
		makeRecursiveMaze(
			mazeArr,
			randomRangeInt(0, mazeCols - 1),
			randomRangeInt(0, mazeRows - 1),
			[],
			0
		)
	})
} // end of loaded
/**
 *
 * @param {Array} arr Array of unvisited MazeCells
 * @param {Number} currentCellX
 * @param {Number} currentCellY
 * @param {Array} stack Starts as empty. Keeps track of path taken
 * @returns
 */
async function makeRecursiveMaze(
	arr,
	currentCellX,
	currentCellY,
	stack
) {

	if (
		mazeGenerationActive == false ||
		!mazeArr[currentCellY] ||
		!mazeArr[currentCellY][currentCellX]
	) {
		alert(
			'things went horribly wrong if you are seeing this message. refresh please'
		)
		return
	}

	currentCell = mazeArr[currentCellY][currentCellX]
	currentCell.visited = true
	currentCell.backtracked = false

	// Track the affected cells

	if (showSteps == true) {
		affectedCells = []
	}
	affectedCells.push(currentCell)

	const nextCell = currentCell.getRandomValidNeighbor()

	if (nextCell != null) {
		// Remove walls and move forward
		removeWalls(currentCell, nextCell)
		stack.push(currentCell) // Push current cell to stack
		currentCell = nextCell
		affectedCells.push(currentCell) // Add next cell to affected array
	} else if (stack.length > 0) {
		// Backtrack if no open neighbors
		currentCell.backtracked = true
		affectedCells.push(currentCell) // Add backtracked cell to affected array
		currentCell = stack.pop()
	} else {
		// Stop when stack is empty/maze is done generating
		currentCell.backtracked = true
		affectedCells.push(currentCell) // Add final cell to affected array
		// Draw all affected cells
		drawMaze(affectedCells)

		currentCell = null // Reset currentCell to prevent it from being yellow
		return
	}

	// Only redraw affected cells
	if (showSteps) {
		drawMaze(affectedCells)

		mazeTimeout = setTimeout(() => {
			makeRecursiveMaze(
				arr,
				currentCell.x,
				currentCell.y,
				stack
			)
		}, animationDelay)
	} else {
		makeRecursiveMaze(
			arr,
			currentCell.x,
			currentCell.y,
			stack
		)
	}
}

function drawMaze(affectedCells) {
	// Loop through all affected cells and draw them
	for (let i = 0; i < affectedCells.length; i++) {
		const cell = affectedCells[i]

		if (cell === currentCell) {
			ctx.fillStyle = currentCellColor
			ctx.strokeStyle = currentCellOutlineColor
		} else if (cell.backtracked === true) {
			ctx.fillStyle = finishedColor
			ctx.strokeStyle = finishedOutlineColor
		} else if (cell.visited === true) {
			ctx.fillStyle = visitedColor
			ctx.strokeStyle = visitedOutlineColor
		}

		// Draw updated cell background
		drawCellBackground(cell)
		// Draw updated cell edge lines
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

		// Check if each neighbor is valid (i.e., within bounds and not visited)
		if (up && !up.visited) {
			neighbors.push(up)
		}
		if (down && !down.visited) {
			neighbors.push(down)
		}
		if (left && !left.visited) {
			neighbors.push(left)
		}
		if (right && !right.visited) {
			neighbors.push(right)
		}

		// Return a random neighbor if there are any valid neighbors
		if (neighbors.length > 0) {
			return neighbors[randomRangeInt(0, neighbors.length - 1)]
		}
		return null // No valid neighbor found
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
