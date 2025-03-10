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
let visitedColor = "#5555DD"
let finishedColor = "#555555"
let currentCellColor = "#FFD700"

let visitedOutlineColor = "#0000FF"
let finishedOutlineColor = "#000000"
let currentCellOutlineColor = "#FF0000"

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
	canvas = getElement("maze")
	ctx = canvas.getContext("2d")
	ctx.imageSmoothingEnabled = false

	columnInput = getElement("columnInput")
	rowInput = getElement("rowInput")
	cellSizeInput = getElement("cellSizeInput")
	mazeGenButtonI = getElement("mazeGenButtonI")
	mazeGenButtonR = getElement("mazeGenButtonR")
	animationDelayInput = getElement("animationDelayInput")
	showStepsToggle = getElement("showStepsToggle")
	weightUpInput = getElement("weightUpInput")
	weightDownInput = getElement("weightDownInput")
	weightLeftInput = getElement("weightLeftInput")
	weightRightInput = getElement("weightRightInput")

	mazeGenButtonI.addEventListener("click", () => genButtonPressed(false))
	mazeGenButtonR.addEventListener("click", () => genButtonPressed(true))
}

function genButtonPressed(doRecursively) {
	// Stop any currently running maze
	if (mazeGenerationActive) {
		stopRequested = true
		mazeGenButtonI.innerText = "Iterative Maze!"
		mazeGenButtonR.style.display = ""
		return
	} else {
		stopRequested = false
		mazeGenButtonI.innerText = "Cancel"
		mazeGenButtonR.style.display = "none"
	}

	// Wait a bit so the previous loop exits (50ms)
	setTimeout(() => {
		// Prevent starting a new maze if one is already running
		if (mazeGenerationActive) return

		mazeRows = parseInt(rowInput.value)
		mazeCols = parseInt(columnInput.value)
		cellSize = parseInt(cellSizeInput.value)
		animationDelay = parseInt(animationDelayInput.value)
		showSteps = showStepsToggle.checked

		if (mazeRows <= 0 || mazeCols <= 0 || cellSize <= 0) {
			alert("Maze dimensions and cell size must be greater than 0!")
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
		canvas.style.display = "inline"

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
			makeRecursiveMaze(mazeArr, 0, 0).then(() => {
				let endTime = performance.now()
				updateStats("rec", "time", Math.round(endTime - startTime) + "ms")
				mazeGenEnd()
			})
		} else {
			makeIterativeMaze(mazeArr, 0, 0).then(() => {
				let endTime = performance.now()
				updateStats("iter", "time", Math.round(endTime - startTime) + "ms")
				mazeGenEnd()
			})
		}
	}, 50) // Small delay to let the previous function exit
}

function mazeGenEnd() {
	mazeGenerationActive = false
	mazeGenButtonI.innerText = "Iterative Maze!"
	mazeGenButtonR.style.display = ""
}
function updateStats(method, metric, value) {
	document.getElementById(`${method}_${metric}`).textContent = value
}

async function makeIterativeMaze(arr, startX, startY) {
	let stack = []
	let currentCell = arr[startY][startX]
	currentCell.visited = true

	let steps = 0
	let backtracks = 0
	let maxStackDepth = 0
	let visitedCells = 1
	let wallsRemoved = 0

	while (true) {
		if (stopRequested) {
			drawMazeCells(affectedCells, null)
			return
		}

		if (showSteps) affectedCells = []
		affectedCells.push(currentCell)
		steps++

		let nextCell = currentCell.getRandomValidNeighbor()
		if (nextCell) {
			removeWalls(currentCell, nextCell)
			stack.push(currentCell)
			maxStackDepth = Math.max(maxStackDepth, stack.length)
			currentCell = nextCell
			currentCell.visited = true
			visitedCells++
			wallsRemoved++
			affectedCells.push(currentCell)
		} else if (stack.length > 0) {
			currentCell.backtracked = true
			affectedCells.push(currentCell)
			currentCell = stack.pop()
			backtracks++
		} else {
			currentCell.backtracked = true
			affectedCells.push(currentCell)
			break
		}

		if (showSteps) {
			drawMazeCells(affectedCells, currentCell)
			updateStats("iter", "steps", steps)
			updateStats("iter", "backtracks", backtracks)
			updateStats("iter", "stack", maxStackDepth)
			updateStats("iter", "visited", visitedCells)
			await new Promise((resolve) => setTimeout(resolve, animationDelay))
		}
	}

	updateStats("iter", "steps", steps)
	updateStats("iter", "backtracks", backtracks)
	updateStats("iter", "stack", maxStackDepth)
	updateStats("iter", "visited", visitedCells)

	if (!stopRequested && (showSteps || (startX === 0 && startY === 0))) {
		drawMazeCells(affectedCells, null)
	}
}

async function makeRecursiveMaze(
	arr,
	x,
	y,
	depth = 0,
	stats = {
		steps: 0,
		backtracks: 0,
		maxDepth: 0,
		visitedCells: 1,
		wallsRemoved: 0,
	}
) {
	if (stopRequested) {
		drawMazeCells(affectedCells, null)
		return
	}

	let currentCell = arr[y][x]
	currentCell.visited = true
	affectedCells.push(currentCell)
	stats.steps++
	stats.maxDepth = Math.max(stats.maxDepth, depth)

	if (showSteps) {
		drawMazeCells(affectedCells, currentCell)
	}

	let neighbors = currentCell.getValidNeighbors()
	for (let nextCell of neighbors) {
		if (stopRequested) return

		if (!nextCell.visited) {
			removeWalls(currentCell, nextCell)
			affectedCells.push(nextCell)
			stats.visitedCells++
			stats.wallsRemoved++

			if (showSteps) {
				updateStats("rec", "steps", stats.steps)
				updateStats("rec", "backtracks", stats.backtracks)
				updateStats("rec", "stack", stats.maxDepth)
				updateStats("rec", "visited", stats.visitedCells)
				drawMazeCells(affectedCells, currentCell)
				await new Promise((resolve) => setTimeout(resolve, animationDelay))
			}

			await makeRecursiveMaze(arr, nextCell.x, nextCell.y, depth + 1, stats)

			if (stopRequested) return
		}
	}

	currentCell.backtracked = true
	affectedCells.push(currentCell)
	stats.backtracks++

	if (showSteps || stopRequested) {
		drawMazeCells(affectedCells, currentCell)
		await new Promise((resolve) => setTimeout(resolve, animationDelay))
	} else if (!showSteps && x === 0 && y === 0) {
		drawMazeCells(affectedCells, null)
	}

	if (depth === 0) {
		updateStats("rec", "steps", stats.steps)
		updateStats("rec", "backtracks", stats.backtracks)
		updateStats("rec", "stack", stats.maxDepth)
		updateStats("rec", "visited", stats.visitedCells)
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
