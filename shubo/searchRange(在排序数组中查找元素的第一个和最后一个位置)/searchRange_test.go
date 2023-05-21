package main

import "testing"

// 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
//
// 如果数组中不存在目标值 target，返回 [-1, -1]。
//
// 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

// 有序，复杂度为 O(log n) 想到二分
// 思路二分先找到target
// 然后向左右找到target的开始结尾索引
func searchRange(nums []int, target int) []int {
	if len(nums) == 0 {
		return []int{-1, -1}
	}
	l, r := 0, len(nums)-1
	mid := 0
	for l <= r {
		mid = l + (r-l)/2
		if target < nums[mid] {
			r = mid - 1
		} else if target > nums[mid] {
			l = mid + 1
		} else {
			break
		}
	}
	if nums[mid] != target {
		return []int{-1, -1}
	}
	for i := mid; i >= 0; i-- {
		if nums[i] != target {
			break
		}
		l = i
	}
	for i := mid; i < len(nums); i++ {
		if nums[i] != target {
			break
		}
		r = i
	}
	return []int{l, r}
}
func TestSearchRange(t *testing.T) {
	//t.Log(searchRange([]int{5, 7, 7, 8, 8, 10}, 8))
	//t.Log(searchRange([]int{5, 7, 7, 8, 8, 10}, 6))
	//t.Log(searchRange([]int{2, 2}, 2))
	t.Log(searchRange([]int{1, 1, 2}, 1))
}
