package main

// 二分

func search(nums []int, target int) int {
	left, right := 0, len(nums)-1

	// 4,5,6,7,0,1,2
	// 0

	var check func(mid int) bool
	check = func(mid int) bool {
		end := nums[len(nums)-1]
		if nums[mid] > end {
			// 说明 当前的点是峰点
			return target > end && nums[mid] >= target
		} else {
			// 说明升序有序
			return target > end || nums[mid] >= target
		}
	}

	for left < right {
		mid := left + (right-left)>>1
		if !check(mid) {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}

	if nums[left] == target {
		return left
	}
	return -1
}
