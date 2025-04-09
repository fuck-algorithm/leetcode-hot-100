package main

import "testing"

// 给你一个整数数组 nums ，你需要找出一个 连续子数组 ，如果对这个子数组进行升序排序，那么整个数组都会变为升序排序。
// 请你找出符合题意的 最短 子数组，并输出它的长度。

// 思路：双指针
// 分为左中右三部分考虑。
// 左右两部分保证升序
// 中间部分保证最大值小于右边，最小值大于左边
// 如果中间部分存在大于右边的值则右指针向右移动到大于这个值的位置
// 如果中间部分存在小于左边的值则左指针向左移动到小于这个值的位置
// 最坏的情况返回 整个数组的长度
func findUnsortedSubarray(nums []int) int {
	if len(nums) <= 1 {
		return 0
	}
	l, r := 0, len(nums)-1
	for i := 0; i < r; i++ {
		if nums[i] > nums[i+1] {
			break
		}
		l++
	}
	for i := r; i > l; i-- {
		if nums[i-1] > nums[i] {
			break
		}
		r--
	}
	if l == 0 && r == len(nums)-1 {
		return len(nums)
	}
	for i := l; i <= r; i++ {
		for l > 0 && nums[i] < nums[l-1] {
			l--
		}

		for r < len(nums)-1 && nums[i] > nums[r+1] {
			r++
		}
	}
	if l == r {
		return 0
	}
	return r - l + 1
}
func TestFindUnsortedSubarray(t *testing.T) {
	t.Log(findUnsortedSubarray([]int{2, 6, 4, 8, 10, 9, 15}))
	t.Log(findUnsortedSubarray([]int{1, 2, 3, 4}))
	t.Log(findUnsortedSubarray([]int{2, 1}))
	t.Log(findUnsortedSubarray([]int{2, 1, 1, 1, 1}))
	t.Log(findUnsortedSubarray([]int{1, 2, 3, 3, 3}))
	t.Log(findUnsortedSubarray([]int{1, 3, 2, 3, 3}))
}
