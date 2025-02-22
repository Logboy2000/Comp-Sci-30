/// global stuff thats set after load
let canvas,
	ctx,
	columnInput,
	rowInput,
	cellSizeInput,
	mazeGenButton,
	animationDelayInput,
	showStepsToggle

<<<<<<< Updated upstream
let squareSize = 20
let mazeCols = 30
let mazeRows = 30
let animationDelay = 200
=======
//// Settings
// Maze Dimensions
let cellSize = 10
let mazeCols = 50
let mazeRows = 40
>>>>>>> Stashed changes

// Animation
let animationDelay = 0
let showSteps = false

// Colors
let unvisitedColor = '#00FF00'
let visitedColor = '#0000DD'
let finishedColor = '#555555'
let currentCellColor = '#FFD700'

let unvisitedOutlineColor = '#00DD00'
let visitedOutlineColor = '#0000FF'
let finishedOutlineColor = '#000000'
let currentCellOutlineColor = '#FF0000'

// Maze Gen
let mazeArr = []
<<<<<<< Updated upstream
=======
let mazeGenerationActive = false // Tracks if a maze is being generated
let mazeTimeout // Store the timeout so we can cancel it
let currentCell = null

function getElement(id) {
	return document.getElementById(id)
}
>>>>>>> Stashed changes

function loaded() {
	canvas = document.getElementById('maze')
	ctx = canvas.getContext('2d')

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

		if(mazeRows <= 0){
			alert("Maze must have more than 0 rows!")
			return
		}
		if(mazeCols <= 0){
			alert("Maze must have more than 0 columns!")
			return
		}
		if(cellSize <= 0){
			alert("Cell size must be greater than 0!")
			return
		}

		canvas.width = mazeCols * cellSize
		canvas.height = mazeRows * cellSize
		
		mazeArr = []

	
		for (let y = 0; y < mazeRows; y++) {
			mazeArr[y] = []
			for (let x = 0; x < mazeCols; x++) {
				const newCell = new MazeCell(x, y)
				mazeArr[y].push(newCell)
			}
		}

<<<<<<< Updated upstream
		makeRecursiveMaze(mazeArr, 0, 0)
	})
} // end of loaded

function makeRecursiveMaze(arr, currentCellX, currentCellY) {
	if (
		currentCellX === undefined || 
		currentCellY === undefined || 
		!mazeArr[currentCellY] || 
		!mazeArr[currentCellY][currentCellX]
	) {
		console.error("Invalid cell coordinates:", currentCellX, currentCellY)
		return
	}

	let currentCell = mazeArr[currentCellY][currentCellX]
=======


		mazeGenerationActive = true // Set flag to prevent multiple generations
		makeRecursiveMaze(mazeArr, randomRangeInt(0,mazeCols-1), randomRangeInt(0,mazeRows-1), [])
		drawMaze()
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
function makeRecursiveMaze(arr, currentCellX, currentCellY, stack) {
	if (
		mazeGenerationActive == false ||
		!mazeArr[currentCellY] ||
		!mazeArr[currentCellY][currentCellX]
	) {
		alert('things went horribly wrong if you are seeing this message. refresh please')
		return
	}

	currentCell = mazeArr[currentCellY][currentCellX]
>>>>>>> Stashed changes
	currentCell.visited = true
	currentCell.backtracked = false

	const nextCell = currentCell.getRandomValidNeighbor()

	if (nextCell != null) {
		// Remove walls and move forward
		removeWalls(currentCell, nextCell)
		stack.push(currentCell) // Push current cell to stack
		currentCell = nextCell
	} else if (stack.length > 0) {
		// Backtrack if no open neighbors
		currentCell.backtracked = true
		currentCell = stack.pop()
	} else {
		// Stop when stack is empty/maze is done generatinf
		currentCell.backtracked = true
		return
	}
<<<<<<< Updated upstream

	drawMaze()
	setTimeout(() => {
		makeRecursiveMaze(arr, currentCell.x, currentCell.y)
	}, animationDelay)
=======
	if (showSteps){
		drawMaze()
		mazeTimeout = setTimeout(() => {
			makeRecursiveMaze(arr, currentCell.x, currentCell.y, stack)
		}, animationDelay)
	} else {
		makeRecursiveMaze(arr, currentCell.x, currentCell.y, stack)
	}
	
>>>>>>> Stashed changes
}


function drawMaze() {
	// Clear Canvas
	ctx.fillStyle = '#FFFFFF'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw cell backgrounds
	for (let y = 0; y < mazeRows; y++) {
		for (let x = 0; x < mazeCols; x++) {
			const cell = mazeArr[y][x]
			if (cell === currentCell) {
				ctx.fillStyle = currentCellColor
			} else if (cell.backtracked === true) {
				ctx.fillStyle = finishedColor
			} else if (cell.visited === true) {
				ctx.fillStyle = visitedColor
			} else {
				ctx.fillStyle = unvisitedColor
			}
			ctx.fillRect(
				cell.drawX,
				cell.drawY,
				cell.drawX + cellSize,
				cell.drawY + cellSize
			)
		}
	}

	// Draw cell edge lines
	for (let y = 0; y < mazeRows; y++) {
		for (let x = 0; x < mazeCols; x++) {
			const cell = mazeArr[y][x]
			if (cell === currentCell) {
				ctx.strokeStyle = currentCellOutlineColor
			} else if (cell.backtracked === true) {
				ctx.strokeStyle = finishedOutlineColor
			} else if (cell.visited === true) {
				ctx.strokeStyle = visitedOutlineColor
			} else {
				ctx.strokeStyle = unvisitedOutlineColor
			}

			const inset = 0.1

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
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
