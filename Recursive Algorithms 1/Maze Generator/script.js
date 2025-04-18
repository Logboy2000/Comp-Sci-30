/// global stuff thats set in loaded
let canvas,
	ctx,
	columnInput,
	rowInput,
	resolutionScaleInput,
	mazeGenButtonIter,
	mazeGenButtonRecur,
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

/// Maze Gen stuff
let mazeArr = []
let cellsToDraw = []
let mazeGenerationActive = false
let stopRequested = false

/**
 * A shorthand for document.getElementById
 * @param {String} id The id of the HTML element to get
 * @returns {HTMLElement}
 */
function getElement(id) {
	return document.getElementById(id)
}

/**
 * Runs when the HTML body is loaded
 */
function loaded() {
	// Get a looooooooooooooooooooooot of elements
	canvas = getElement('maze')
	ctx = canvas.getContext('2d')
	columnInput = getElement('columnInput')
	rowInput = getElement('rowInput')
	resolutionScaleInput = getElement('cellSizeInput')
	mazeGenButtonIter = getElement('mazeGenButtonI')
	mazeGenButtonRecur = getElement('mazeGenButtonR')
	animationDelayInput = getElement('animationDelayInput')
	showStepsToggle = getElement('showStepsToggle')
	weightUpInput = getElement('weightUpInput')
	weightDownInput = getElement('weightDownInput')
	weightLeftInput = getElement('weightLeftInput')
	weightRightInput = getElement('weightRightInput')

	mazeGenButtonIter.addEventListener('click', () => startMazeGeneration(false))
	mazeGenButtonRecur.addEventListener('click', () => startMazeGeneration(true))
}

/**
 * Starts the initial maze generation
 * @param {Boolean} doRecursively If false then maze gen is done iterativley
 * @returns void
 */
function startMazeGeneration(doRecursively) {
	// Stop any currently running maze
	if (mazeGenerationActive) {
		stopRequested = true
		mazeGenButtonIter.innerText = 'Iterative Maze!'
		mazeGenButtonRecur.style.display = ''
		return
	} else {
		stopRequested = false
		mazeGenButtonIter.innerText = 'Cancel'
		mazeGenButtonRecur.style.display = 'none'
	}

	// Wait a bit so the previous maze loop finishes (50ms)
	setTimeout(() => {
		// Prevent starting a new maze if one is already running
		if (mazeGenerationActive) return

		// Get values from settings boxes
		mazeRows = parseInt(rowInput.value)
		mazeCols = parseInt(columnInput.value)
		cellSize = parseFloat(resolutionScaleInput.value) * 15
		animationDelay = parseInt(animationDelayInput.value)
		showSteps = showStepsToggle.checked
		directionWeights = {
			up: parseInt(weightUpInput.value),
			down: parseInt(weightDownInput.value),
			left: parseInt(weightLeftInput.value),
			right: parseInt(weightRightInput.value),
		}
		// Make sure settings values are valid
		if (mazeRows <= 0 || mazeCols <= 0 || cellSize <= 0 || animationDelay < 0) {
			alert('Maze dimensions and cell size must be greater than 0!')
			return
		}

		// Show and resize canvas to fit maze
		canvas.width = mazeCols * cellSize
		canvas.height = mazeRows * cellSize
		canvas.style.display = 'inline'

		// Reset maze array and related values
		mazeArr = []
		for (let y = 0; y < mazeRows; y++) {
			mazeArr[y] = []
			for (let x = 0; x < mazeCols; x++) {
				mazeArr[y].push(new MazeCell(x, y))
			}
		}
		cellsToDraw = []
		mazeGenerationActive = true

		// Used to track how long maze gen took
		let startTime = performance.now()
		// Generate the maze recursivley or iterativley depending on input
		// Then update the stats
		if (doRecursively) {
			makeRecursiveMaze(mazeArr, 0, 0).then(() => {
				getElement('rec_time').innerText =
					Math.round(performance.now() - startTime) + 'ms'
				mazeGenEnd()
			})
		} else {
			makeIterativeMaze(mazeArr, 0, 0).then(() => {
				getElement('iter_time').innerText =
					Math.round(performance.now() - startTime) + 'ms'
				mazeGenEnd()
			})
		}
	}, 50) // Small delay to let the previous function exit
}

/**
 * Resets values for after a maze finishes
 */
function mazeGenEnd() {
	mazeGenerationActive = false
	mazeGenButtonIter.innerText = 'Iterative Maze!'
	mazeGenButtonRecur.style.display = ''
}

/**
 * Makes a maze and draws it with an iterative solution
 * @param {MazeCell[]} arr The input array (full of new MazeCell objects)
 * @param {Number} startX Starting x for maze gen
 * @param {Number} startY Starting y for maze gen
 */
async function makeIterativeMaze(arr, startX, startY) {
	// Emulates the stack used in recursion
	let stack = []

	// Sets the starting cell to visited
	let currentCell = arr[startY][startX]
	currentCell.visited = true

	// While loop runs until broken inside the function
	while (true == true) {
		// Prevents running if a stop is requested by the user
		if (stopRequested) {
			drawMazeCells(cellsToDraw, null)
			return
		}

		// Resets effected cells when showing steps so it only draws the maze cells that change
		if (showSteps) {
			cellsToDraw = []
		}

		// Makes the current cell one that is drawn
		cellsToDraw.push(currentCell)

		// Gets a next cell to use
		let nextCell = currentCell.getRandomValidNeighbor()

		// if there is a next cell, then remove the walls between it and the current one
		if (nextCell) {
			removeWalls(currentCell, nextCell)
			stack.push(currentCell)
			currentCell = nextCell
			currentCell.visited = true
			cellsToDraw.push(currentCell)
		}
		// If there is no next cell, but backtracking is possible, do it
		else if (stack.length > 0) {
			currentCell.backtracked = true
			cellsToDraw.push(currentCell)
			currentCell = stack.pop()
		}
		// If there is no next cell or backtracking to do, then exit the loop
		else {
			currentCell.backtracked = true
			cellsToDraw.push(currentCell)
			break
		}

		// Draw every step if checked
		if (showSteps) {
			drawMazeCells(cellsToDraw, currentCell)
			await new Promise((resolve) => setTimeout(resolve, animationDelay))
		}
	}

	// Draw maze cells one last time with no cell as the current one
	drawMazeCells(cellsToDraw, null)
}
/**
 * Makes a maze and draws it with a recrusive solution
 * @param {MazeCell[]} arr
 * @param {*} x	X Position in the maze currently
 * @param {*} y Y Position in the maze currently
 * @returns {void}
 */
async function makeRecursiveMaze(arr, x, y) {
	// Stops the generation early when stop requested
	if (stopRequested) {
		drawMazeCells(cellsToDraw, null)
		return
	}

	// Get current cell and set it as visited and to be drawn
	let currentCell = arr[y][x]
	currentCell.visited = true
	cellsToDraw.push(currentCell)

	// Draw every step if told to
	if (showSteps) {
		drawMazeCells(cellsToDraw, currentCell)
	}

	// Gets the valid neighbors
	let neighbors = currentCell.getValidNeighbors()
	for (let nextCell of neighbors) {
		// Stops the generation early when stop requested
		if (stopRequested) return

		if (!nextCell.visited) {
			removeWalls(currentCell, nextCell)
			cellsToDraw.push(nextCell)

			if (showSteps) {
				drawMazeCells(cellsToDraw, currentCell)
				await new Promise((resolve) => setTimeout(resolve, animationDelay))
			}

			// recursive call
			await makeRecursiveMaze(arr, nextCell.x, nextCell.y)

			// Stops the generation early when stop requested
			if (stopRequested) return
		}
	}

	currentCell.backtracked = true
	cellsToDraw.push(currentCell)

	if (showSteps || stopRequested) {
		drawMazeCells(cellsToDraw, currentCell)
		await new Promise((resolve) => setTimeout(resolve, animationDelay))
	} else if (!showSteps && x === 0 && y === 0) {
		drawMazeCells(cellsToDraw, null)
	}
}

/**
 * Draws the given maze cells in different colors depending on their state
 * @param {MazeCell[]} affectedCells An array of the affected cells
 * @param {MazeCell} currentCell The currently active cell (drawn in a different color)
 */
function drawMazeCells(affectedCells, currentCell) {
	// loop through all cells and draw
	for (let cell of affectedCells) {
		if (cell === currentCell) {
			// Draw Current cell
			ctx.fillStyle = currentCellColor
			ctx.strokeStyle = currentCellOutlineColor
		} else if (cell.backtracked) {
			// Draw Cell Thats been backtracked to
			ctx.fillStyle = finishedColor
			ctx.strokeStyle = finishedOutlineColor
		} else if (cell.visited) {
			// Draw cell that has not been backtracked to
			ctx.fillStyle = visitedColor
			ctx.strokeStyle = visitedOutlineColor
		}
		// Draw Background
		ctx.fillRect(cell.drawX, cell.drawY, cellSize, cellSize)
		// Draw Walls on top
		drawCellWalls(cell)
	}
}

/**
 *
 * @param {MazeCell} cell Draws the walls of a maze cell based on it's properties
 */
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

/**
 * A class for a maze cell that keeps
 */
class MazeCell {
	/**
	 * Sets up the maze cell
	 * @param {*} x The cells x position on the grid
	 * @param {*} y The cells y position on the grid
	 */
	constructor(x = 0, y = 0) {
		// Sets the position of the cell
		this.x = x
		this.y = y

		// Tracks the cell's state
		this.visited = false
		this.backtracked = false

		// Tracks which walls are active [Up, Right, Down, Left]
		this.walls = [true, true, true, true]

		// Get the draw position
		this.drawX = this.x * cellSize
		this.drawY = this.y * cellSize
	}

	/**
	 * 
	 * @param {Boolean} weighted Whether or not the returned array should be weighted
	 * @returns An array of the valid neighbors
	 */
	getValidNeighborsList(weighted = false) {
		let validNeighbors = []

		// Get all neighbor cells
		const neighbors = {
			up: mazeArr[this.y - 1] && mazeArr[this.y - 1][this.x],
			down: mazeArr[this.y + 1] && mazeArr[this.y + 1][this.x],
			left: mazeArr[this.y] && mazeArr[this.y][this.x - 1],
			right: mazeArr[this.y] && mazeArr[this.y][this.x + 1],
		}

		for (let dir in neighbors) {
			let neighbor = neighbors[dir]
			if (neighbor && !neighbor.visited) {
				// Adds extra cells if they are weighted in certain directions
				if (weighted) {
					for (let i = 0; i < directionWeights[dir]; i++) {
						validNeighbors.push(neighbor)
					}
				} else {
					validNeighbors.push(neighbor)
				}
			}
		}

		return validNeighbors
	}

	/**
	 * Returns a random valid neighbor maze cell
	 * @returns {MazeCell} Random valid neighbor cell
	 */
	getRandomValidNeighbor() {
		const neighbors = this.getValidNeighborsList(true)
		if (neighbors.length > 0) {
			return neighbors[randomRangeInt(0, neighbors.length - 1)]
		}
		return null
		
	}

	/**
	 * Returns an array of all valid neighbor cells
	 * @returns {MazeCell[]} Array of all valid neighbor cells
	 */
	getValidNeighbors() {
		return this.getValidNeighborsList().sort(() => Math.random() - 0.5)
	}
}

/**
 * Takes in two cells and destroys the walls between them 
 * @param {*} cell1 The first cell
 * @param {*} cell2 The second cell
 */
function removeWalls(cell1, cell2) {
	let x = cell1.x - cell2.x
	let y = cell1.y - cell2.y

	if (x === 1) {
		cell1.walls[3] = false
		cell2.walls[1] = false
	} else if (x === -1) {
		cell1.walls[1] = false
		cell2.walls[3] = false
	}

	if (y === 1) {
		cell1.walls[0] = false
		cell2.walls[2] = false
	} else if (y === -1) {
		cell1.walls[2] = false
		cell2.walls[0] = false
	}
}

/**
 * Helper function to draw a line on a canvas
 * @param {CanvasRenderingContext2D} ctx The 2d canvas context
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 */
function drawLine(ctx, x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.lineWidth = Math.round(cellSize / 10)
	ctx.stroke()
}

/**
 * Helper function to return a random integer between the two values
 * @param {*} min Minimum value (inclusive)
 * @param {*} max Maximum value (inclusive)
 * @returns {Number} The random number
 */
function randomRangeInt(min, max) {
	if (min == max) {
		return min
	}
	return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Downloads the current maze canvas as a file
 * (triggered by a button)
 */
function downloadMazeCanvas() {
	// Convert the canvas to data
	var image = canvas.toDataURL()
	// Create a link
	var aDownloadLink = document.createElement('a')
	// Add the name of the file to the link
	aDownloadLink.download = 'maze.png'
	// Attach the data to the link
	aDownloadLink.href = image
	// Get the code to click the download link
	aDownloadLink.click()
}
