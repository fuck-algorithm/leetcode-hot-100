package main

func searchRange(nums []int, target int) []int {
	l1 := lowBound(nums, target)
	if l1 >= len(nums) || nums[l1] != target {
		return []int{-1, -1}
	}
	return []int{l1, lowBound(nums, target+1) - 1}
}

func lowBound(nums []int, target int) int {
	l, r := 0, len(nums)-1
	for l <= r {
		mid := l + (r-l)>>1
		if nums[mid] < target {
			l = mid + 1
		} else {
			r = mid - 1
		}
	}
	return l
}
