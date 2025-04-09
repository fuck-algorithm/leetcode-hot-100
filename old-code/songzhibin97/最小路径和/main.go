package main

//func minPathSum(grid [][]int) int {
//	val := int(1e9 + 7)
//	var dfs func(i, j int, val int)
//	dfs = func(i, j int, vs int) {
//		if i < 0 || i >= len(grid) || j < 0 || j >= len(grid[0]) {
//			return
//		}
//
//		vs += grid[i][j]
//
//		if vs > val {
//			return
//		}
//
//		if i == len(grid)-1 && j == len(grid[0])-1 {
//			val = min(val, vs)
//			return
//		}
//		dfs(i+1, j, vs)
//		dfs(i, j+1, vs)
//	}
//
//	dfs(0, 0, 0)
//	return val
//}

func minPathSum(grid [][]int) int {
	for i := 0; i < len(grid); i++ {
		for j := 0; j < len(grid[0]); j++ {
			if i == 0 && j == 0 {
				continue
			}
			if i == 0 {
				grid[i][j] = grid[i][j-1] + grid[i][j]
				continue
			}
			if j == 0 {
				grid[i][j] = grid[i-1][j] + grid[i][j]
				continue
			}
			grid[i][j] = min(grid[i][j-1], grid[i-1][j]) + grid[i][j]
		}
	}

	return grid[len(grid)-1][len(grid[0])-1]
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
