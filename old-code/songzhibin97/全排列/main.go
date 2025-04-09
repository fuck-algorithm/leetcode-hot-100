package main

func permute(nums []int) [][]int {
	res := [][]int{}
	path := []int{}
	hash := make(map[int]bool)

	var dfs func(deep int)
	dfs = func(deep int) {
		if deep == len(nums) {
			if len(path) == len(nums) {
				cp := make([]int, len(path))
				copy(cp, path)
				res = append(res, cp)
			}
			return
		}

		for _, num := range nums {
			if hash[num] {
				continue
			}
			hash[num] = true
			path = append(path, num)
			dfs(deep + 1)
			hash[num] = false
			path = path[:len(path)-1]
		}

	}
	dfs(0)
	return res
}
