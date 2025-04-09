package main

import (
	"sort"
	"testing"
)

func TestCombinationSum(t *testing.T) {
	t.Log(combinationSum([]int{2, 3, 6, 7}, 7))
}

// dfs + 回溯
func combinationSum(candidates []int, target int) [][]int {
	sort.Ints(candidates)
	var ans [][]int
	var path []int
	var dfs func(offset, target int)
	dfs = func(offset, target int) {
		if target == 0 {
			ans = append(ans, append([]int{}, path...))
			return
		}
		for i := offset; i < len(candidates); i++ {
			if target < candidates[i] {
				break
			}
			path = append(path, candidates[i])
			dfs(i, target-candidates[i])
			path = path[:len(path)-1]
		}
	}
	dfs(0, target)
	return ans
}
