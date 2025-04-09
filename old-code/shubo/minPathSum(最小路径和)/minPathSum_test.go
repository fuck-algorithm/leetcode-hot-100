package main

// 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
//
// 说明：每次只能向下或者向右移动一步。

// 一眼贪心，每次选最小的走
// 直接原地修改
func minPathSum(grid [][]int) int {
	m := len(grid)
	n := len(grid[0])
	for i := 1; i < m; i++ {
		grid[i][0] += grid[i-1][0]
	}
	for i := 1; i < n; i++ {
		grid[0][i] += grid[0][i-1]
	}
	for i := 1; i < m; i++ {
		for j := 1; j < n; j++ {
			grid[i][j] = grid[i][j] + min(grid[i-1][j], grid[i][j-1])
		}
	}
	return grid[m-1][n-1]
}
func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
