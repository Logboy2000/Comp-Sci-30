let canvas, ctx

let squareSize = 10
let mazeCols = 100
let mazeRows = 60
let animationDelay = 1

let mazeArr = []
let currentCell

function loaded() {
	canvas = document.getElementById('maze')
	ctx = canvas.getContext('2d')

	const mazeGenButton = document.getElementById('mazeGenButton')
	mazeGenButton.addEventListener('click', function () {
		canvas.width = mazeCols * squareSize
		canvas.height = mazeRows * squareSize

		ctx.fillStyle = '#FFFFFF'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		mazeArr = []

		for (let y = 0; y < mazeRows; y++) {
			mazeArr[y] = []
			for (let x = 0; x < mazeCols; x++) {
				const newCell = new MazeCell(x, y, false)
				mazeArr[y].push(newCell)
			}
		}

		makeRecursiveMaze(mazeArr, 0)
	})
} // end of loaded

function makeRecursiveMaze(arr, i) {
	//Base case
	if (i >= arr.length * arr[0].length) {
		return
	}

	const x = i % mazeCols
	const y = Math.floor(i / mazeCols)

	currentCell = arr[y][x]

	currentCell.visited = true

	const nextCell = currentCell.getRandomValidNeighbor()
	if (nextCell != null) {
		// Remove walls between current cell and next cell
		removeWalls(currentCell, nextCell)
		currentCell = nextCell // Move to the next cell
	}

	drawMaze()

	setTimeout(() => {
		makeRecursiveMaze(arr, i + 1)
	}, animationDelay)
}

function drawMaze() {
	for (let y = 0; y < mazeRows; y++) {
		for (let x = 0; x < mazeCols; x++) {
			const cell = mazeArr[y][x]
			if (cell.visited === true) {
				ctx.fillStyle = '#00FF00'
				ctx.fillRect(
					cell.drawX,
					cell.drawY,
					cell.drawX + squareSize,
					cell.drawY + squareSize
				)
			}

			// up
			if (cell.walls[0]) {
				drawLine(
					ctx,
					cell.drawX,
					cell.drawY,
					cell.drawX + squareSize,
					cell.drawY
				)
			}
			// right
			if (cell.walls[1]) {
				drawLine(
					ctx,
					cell.drawX + squareSize,
					cell.drawY,
					cell.drawX + squareSize,
					cell.drawY + squareSize
				)
			}
			// down
			if (cell.walls[2]) {
				drawLine(
					ctx,
					cell.drawX,
					cell.drawY + squareSize,
					cell.drawX + squareSize,
					cell.drawY + squareSize
				)
			}
			// left
			if (cell.walls[3]) {
				drawLine(
					ctx,
					cell.drawX,
					cell.drawY,
					cell.drawX,
					cell.drawY + squareSize
				)
			}
		}
	}
}

class MazeCell {
	constructor(x = 0, y = 0, visited = false) {
		this.visited = visited
		this.walls = [true, true, true, true] // [Up, Right, Down, Left]
		this.x = x
		this.y = y
		this.drawX = this.x * squareSize
		this.drawY = this.y * squareSize
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

function randomRangeInt(min, max) {
	if (min == max) {
		return min
	}
	return Math.floor(Math.random() * (max - min + 1) + min)
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

function drawLine(ctx, x1, y1, x2, y2, color = '#FF0000') {
	ctx.strokeStyle = color
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.lineWidth = Math.round(squareSize / 10)
	ctx.stroke()
}
