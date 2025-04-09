package main

//给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的连续子数组的个数 。

// 暴力： 枚举所有子树组，和为k则记述加一。 时间复杂度O(n^2+)

// 子数组：是连续的
// 子序列：是不连续的
//
//	可以用前缀和+hash表优化时间复杂度
//
// 思路：
// S(n)表示nums的前n项和 通项公式S(n) = S(n-1) + nums[n]
// 如果想知道某一个区间的子数组和K，例如[2...3]之间
// K = S(3) - S(1)
// 不失一般性，在[i...j]之间
// 推出 K = S(i) - S(j-1)
// 移项 S(j-1) = S(i) - K
// 我们可以将前缀和通过hash表保存起来
// 初始情况下前缀和hash[0] = 1
// 当S(i) - K在hash表中存在时说明S(i) - S(j-1) = K  即子数组和为K

func subarraySum(nums []int, k int) int {
	var hash = map[int]int{0: 1}
	ans, preCount := 0, 0
	for i := 0; i < len(nums); i++ {
		preCount += nums[i]
		if v, ok := hash[preCount-k]; ok {
			ans += v
		}
		hash[preCount]++
	}
	return ans
}
