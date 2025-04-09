package main

func subsets(nums []int) [][]int {
	var res [][]int
	var path []int

	var dfs func(deep int)
	dfs = func(deep int) {
		if deep == len(nums) {
			cp := make([]int, len(path))
			copy(cp, path)
			res = append(res, cp)
			return
		}

		dfs(deep + 1)

		path = append(path, nums[deep])
		dfs(deep + 1)
		path = path[:len(path)-1]
	}

	dfs(0)
	return res
}
