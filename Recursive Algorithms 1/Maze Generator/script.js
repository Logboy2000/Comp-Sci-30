
/*
Here’s the mile-high view of recursive backtracking:
	1) Choose a starting point in the field.
	2) Randomly choose a wall at that point and carve a passage through to the adjacent cell, but only if the adjacent cell has not been visited yet. This becomes the new current cell.
	3) If all adjacent cells have been visited, back up to the last cell that has uncarved walls and repeat.
	4) The algorithm ends when the process has backed all the way up to the starting point.
*/
function loaded() {
	var canvas = document.getElementById("maze")
	var ctx = canvas.getContext("2d")
	var maxWidth = 20
	var maxHeight = 20
	var squareSize = 32

	x = 0
	y = 0

	canvas.width = maxWidth * squareSize
	canvas.height = maxHeight * squareSize

	// clear the canvas
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	mazeArr = new Array()
	mazeArr.length = maxWidth
	for (i = 0; i < maxHeight; i++) {
		mazeArr[i] = new Array()
	}
	// put 0 in all array values
	for (col = 0; col < maxWidth; col++) {
		for (row = 0; row < maxHeight; row++) {
			mazeArr[row][col] = 0
		}
	}

	makeRecursiveMaze(mazeArr, randomFromInterval(0, maxWidth - 1), randomFromInterval(0, maxHeight - 1), [], ctx, squareSize, maxWidth * maxHeight)
}// end of loaded

function makeRecursiveMaze(maze, x, y, from, ctx, GridSize, numCells) {
	//base case ... cell has been visited

}

function drawMaze(mazeArr){

}