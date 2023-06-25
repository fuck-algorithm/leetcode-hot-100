package main

// 给你一个整数数组 nums 和一个整数 target 。
//
// 向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：
//
// 例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
// 返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。

// 人脑思路 ： 枚举所有符号组合，计数统计满足的
// 枚举方式可以用递归回溯法 不过显然这种方式比较笨。（但是居然没超时）
// 这样可能会产生O(n)的函数栈空间。时间复杂度是O(2^n)
func findTargetSumWays(nums []int, target int) int {
	var ans = 0
	var r func(idx, sum int)
	r = func(idx, sum int) {
		if idx == len(nums) {
			if sum == target {
				ans++
			}
			return
		}
		r(idx+1, sum+nums[idx])
		r(idx+1, sum-nums[idx])
	}
	r(0, 0)
	return ans
}

//https://leetcode.cn/problems/target-sum/solutions/816361/mu-biao-he-by-leetcode-solution-o0cp/
// TODO 官方题解dp
