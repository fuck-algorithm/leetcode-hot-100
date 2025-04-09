package main

import "fmt"

// 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
//
// 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
//
// 返回容器可以储存的最大水量。
//
// 说明：你不能倾斜容器。

// 条件梳理：
// 1.闭合区间
// 2.height取min
// 3. wight为right-left
// 4. 容水量=height*(right-left)
func maxArea(height []int) int {
	left := 0
	right := len(height) - 1
	ret := 0
	for left < right {
		w := right - left
		var h int
		if height[right] > height[left] {
			h = left
			left++
		} else {
			h = right
			right--
		}
		ret = max(ret, height[h]*w)
	}
	return ret
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
func main() {
	fmt.Println(maxArea([]int{1, 8, 6, 2, 5, 4, 8, 3, 7}))
	fmt.Println(maxArea([]int{1, 1}))
}
