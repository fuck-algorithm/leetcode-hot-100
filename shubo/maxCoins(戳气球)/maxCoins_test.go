package main

import "testing"

// 有 n 个气球，编号为0 到 n - 1，每个气球上都标有一个数字，这些数字存在数组 nums 中。
// 现在要求你戳破所有的气球。戳破第 i 个气球，
// 你可以获得 nums[i - 1] * nums[i] * nums[i + 1] 枚硬币。
// 这里的 i - 1 和 i + 1 代表和 i 相邻的两个气球的序号。
// 如果 i - 1或 i + 1 超出了数组的边界，那么就当它是一个数字为 1 的气球。
// 求所能获得硬币的最大数量。

//看了题解: https://leetcode.cn/problems/burst-balloons/solution/zhe-ge-cai-pu-zi-ji-zai-jia-ye-neng-zuo-guan-jian-/

// 设本次戳破k能在开区间(i,j)获得最大硬币数。
// 得出递推公式 dp[i][j] = dp[i][k]+nums[i] * nums[j] * nums[k] + dp[k][j]
// 枚举所有nums中的位置k，取最大值来更新dp[i][j]
func maxCoins(nums []int) int {
	nums = append([]int{1}, nums...)
	nums = append(nums, 1)
	var dp [][]int
	for i := 0; i < len(nums); i++ {
		var ii []int
		for j := 0; j < len(nums); j++ {
			ii = append(ii, 0)
		}
		dp = append(dp, ii)
	}
	var rangeBest func(i, j int)

	rangeBest = func(i, j int) {
		curMax := 0
		for k := i + 1; k < j; k++ {
			curMax = max(curMax, dp[i][k]+dp[k][j]+nums[i]*nums[k]*nums[j])
		}
		dp[i][j] = curMax
	}
	for i := 2; i < len(nums); i++ {
		for j := 0; j < len(nums)-i; j++ {
			rangeBest(j, i+j)
		}
	}
	return dp[0][len(nums)-1]
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
func TestMaxCoins(t *testing.T) {
	t.Log(maxCoins([]int{3, 1, 5, 8}))
}
