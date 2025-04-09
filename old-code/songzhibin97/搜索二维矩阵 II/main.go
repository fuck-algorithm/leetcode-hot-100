package main

func searchMatrix(matrix [][]int, target int) bool {

	// 1  3  4  6  [9]
	// 2  5  7 [8] 10
	// 11 12 [13] 14 15
	// 16 17 18 19 20

	col, row := len(matrix), len(matrix[0])
	x, y := 0, row-1
	for x < col && y >= 0 {
		if matrix[x][y] == target {
			return true
		}
		if matrix[x][y] > target {
			y--
		} else {
			x++
		}
	}
	return false
}
