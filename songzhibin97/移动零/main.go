package main

func moveZeroes(nums []int) {
	idx := 0
	for i := 0; i < len(nums); i++ {
		if nums[i] != 0 {
			nums[i], nums[idx] = nums[idx], nums[i]
			idx++
		}
	}
}
