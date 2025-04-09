package main

func combinationSum(candidates []int, target int) [][]int {
	// 暴力 dfs
	res := [][]int{}
	path := []int{}
	var dfs func(deep int, target int)
	dfs = func(deep int, target int) {
		if deep == len(candidates) {
			return
		}
		if target == 0 {
			if len(path) != 0 {
				cp := make([]int, len(path))
				copy(cp, path)
				res = append(res, cp)
			}
			return
		}

		// 不选
		dfs(deep+1, target)

		// 选
		if target-candidates[deep] >= 0 {
			path = append(path, candidates[deep])
			dfs(deep, target-candidates[deep])
			path = path[:len(path)-1]
		}

	}
	dfs(0, target)
	return res

}
