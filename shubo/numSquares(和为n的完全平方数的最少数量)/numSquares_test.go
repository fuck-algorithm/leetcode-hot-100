package main

import (
	"math"
	"sort"
	"testing"
)

//	给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。
//	完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。
//	例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。

// 提示：
// 1 <= n <= 10^4

// 数量最少，那么其实这个数字就是要尽可能大
// 想到贪心,想到回溯
// 1. 由整数n可以推出 完全平方数 组成的数组
// 2. 该题转换为从一个递增的完全平方数数组里找最短的组合的数量 使其相加等于n
// FIXME: 这样套娃会超时
//func numSquares(n int) int {
//	//hash := map[int]bool{}
//	i := 1
//	var nums []int
//	for i*i <= n {
//		//hash[i*i] = true
//		nums = append(nums, i*i)
//		i++
//	}
//	x := combinationSum(nums, n)
//	for _, xx := range x {
//		n = min(n, len(xx))
//	}
//	return n
//}

// 官方题解dp
func numSquares(n int) int {
	f := make([]int, n+1)
	for i := 1; i <= n; i++ {
		minn := math.MaxInt32
		for j := 1; j*j <= i; j++ {
			minn = min(minn, f[i-j*j])
		}
		f[i] = minn + 1
	}
	return f[n]
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
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

func TestNumSquares(t *testing.T) {
	//t.Log(numSquares(12))
	t.Log(numSquares(259)) // 超时
}
