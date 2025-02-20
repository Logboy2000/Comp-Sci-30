
/*
Here’s the mile-high view of recursive backtracking:
	1) Choose a starting point in the field.
	2) Randomly choose a wall at that point and carve a passage through to the adjacent cell, but only if the adjacent cell has not been visited yet. This becomes the new current cell.
	3) If all adjacent cells have been visited, back up to the last cell that has uncarved walls and repeat.
	4) The algorithm ends when the process has backed all the way up to the starting point.
*/

var canvas
var ctx

function loaded() {
	canvas = document.getElementById("maze")
	ctx = canvas.getContext("2d")

	let mazeWidth = 200
	let mazeHeight = 200
	let squareSize = 32

	x = 0
	y = 0

	mazeArr = new Array()
	mazeArr.length = mazeWidth
	for (i = 0; i < mazeHeight; i++) {
		mazeArr[i] = new Array()
	}

	// put 0 in all array values
	for (col = 0; col < mazeWidth; col++) {
		for (row = 0; row < mazeHeight; row++) {
			mazeArr[col][row] = false
		}
	}




	document.getElementById('mazeGenButton').addEventListener('click', function () {
		canvas.width = mazeWidth * squareSize
		canvas.height = mazeHeight * squareSize
		for (col = 0; col < mazeWidth; col++) {
			for (row = 0; row < mazeHeight; row++) {
				mazeArr[col][row] = true
			}
		}
		mazeArr = makeRecursiveMaze(0, 0, mazeWidth, mazeHeight, mazeArr, squareSize, ctx)
	})
}// end of loaded

function makeRecursiveMaze(x, y, w, h, from, gridSize, ctx) {
	from[x][y] = false


	let dx = randomRangeInt(-1, 1)
	let dy = randomRangeInt(-1, 1)
	if (dx == 0 && dy == 0) {
		dx++
	}
	while (from[x + dx] == false) {
		dx = randomRangeInt(-1, 1)
	}

	setTimeout(function () {
		drawMaze(ctx, from, gridSize)
		return makeRecursiveMaze(x + dx, y + dy, w, h, from, gridSize, ctx)
	}, 100)
}

function drawMaze(ctx, mazeArr, squareSize) {
	for (let col = 0; col < mazeArr.length; col++) {
		for (let row = 0; row < mazeArr[0].length; row++) {
			if (mazeArr[col][row] == true) {
				ctx.fillStyle = '#000000'
			} else {
				ctx.fillStyle = '#FFFFFF'
			}
			ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize)
		}
	}
}

function randomRangeInt(min, max) {
	if (min == max) {
		return min
	}

	return Math.round(Math.random() * (max - min + 1) + min);
}