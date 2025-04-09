package main

import (
	"testing"
)

//给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

// 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
// 输出：6
// 解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。

// TODO 单调站 或者dp

// 题解：https://leetcode.cn/problems/trapping-rain-water/solutions/9112/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-by-w-8/

// dp
func trap(height []int) int {

	ans := 0
	var maxRight, maxLeft []int
	for i := 0; i < len(height); i++ {
		maxRight = append(maxRight, 0)
		maxLeft = append(maxLeft, 0)
	}
	for i := 1; i < len(height)-1; i++ {
		maxLeft[i] = max(maxLeft[i-1], height[i-1])
	}
	for i := len(height) - 2; i >= 0; i-- {
		maxRight[i] = max(maxRight[i+1], height[i+1])
	}
	for i := 1; i < len(height)-1; i++ {
		m := min(maxLeft[i], maxRight[i])
		if m > height[i] {
			ans += m - height[i]
		}
	}
	return ans
}
func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
func max(a, b int) int {
	if a < b {
		return b
	}
	return a
}
func TestTrap(t *testing.T) {
	//t.Log(trap([]int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}))
	t.Log(trap([]int{4, 2, 3}))
}
