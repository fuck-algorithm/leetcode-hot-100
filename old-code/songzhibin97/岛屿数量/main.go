package main

func numIslands(grid [][]byte) int {
	nx, ny := []int{0, 1, 0, -1}, []int{1, 0, -1, 0}
	res := 0
	var dfs func(i, j int)
	dfs = func(i, j int) {
		if i < 0 || j < 0 || i >= len(grid) || j >= len(grid[0]) {
			return
		}
		if grid[i][j] != '1' {
			return
		}
		grid[i][j] = '2'

		for v := 0; v < 4; v++ {
			x, y := nx[v]+i, ny[v]+j
			dfs(x, y)
		}
	}
	for i := 0; i < len(grid); i++ {
		for j := 0; j < len(grid[0]); j++ {
			if grid[i][j] == '1' {
				res++
				dfs(i, j)
			}
		}
	}
	return res
}
