package main

import "testing"

//整数数组 nums 按升序排列，数组中的值 互不相同 。
//在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，
//使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。
//例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。
//给你 旋转后 的数组 nums 和一个整数 target ，
//如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
//你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。

// 翻转后相当于一个升序数组变成了两个升序序列
// 看到有序数组让找target ，就要想到二分法
// 他还要求O(log n) 那就更要想到二分法
// 先找到升序的极值点，划分左右两个升序序列，然后二分查找target
func search(nums []int, target int) int {
	if len(nums) == 0 {
		return -1
	}

	start, end := 0, len(nums)-1
	for start <= end {
		mid := start + (end-start)/2
		if nums[0] > nums[mid] {
			end = mid - 1
		} else {
			start = mid + 1
		}
	}
	if target >= nums[0] {
		start = 0
	} else {
		end = len(nums) - 1
	}

	for start <= end {
		mid := start + (end-start)/2
		if nums[mid] > target {
			end = mid - 1
		} else if nums[mid] == target {
			return mid
		} else {
			start = mid + 1
		}

	}
	return -1
}
func TestSearch(t *testing.T) {
	//t.Log(search([]int{4, 5, 6, 7, 0, 1, 2}, 0))
	//t.Log(search([]int{3, 5, 1}, 3))
	//t.Log(search([]int{3, 1}, 3))
	//t.Log(search([]int{1, 3}, 1))
	//t.Log(search([]int{1, 3}, 3))
	t.Log(search([]int{1, 3}, 2))
}
