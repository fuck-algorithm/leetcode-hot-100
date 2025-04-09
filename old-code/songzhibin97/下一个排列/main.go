package main

func nextPermutation(nums []int) {
	// 1,2,3 -> 1,3,2
	// 1,2,3,4 -> 1,2,4,3
	// 1,1,5 -> 1,5,1
	// 3,2,1 -> 1,2,3 (?)

	match := -1
	for i := len(nums) - 1; i > 0; i-- {
		if nums[i] > nums[i-1] {
			// 找到一个比自己小的数了
			// 1,2,3
			// nums[i-1] = 2
			// nums[i] = 3
			// 3 > 2 互换位置
			match = i - 1
			break
		}
	}

	if match == -1 {
		// 已经是排好序的了
		reverse(nums, 0, len(nums)-1)
		return
	}

	for i := len(nums) - 1; i > match; i-- {
		// 继续从尾巴开始遍历,找到那个差异值
		if nums[i] > nums[match] {
			// 找到一个最小大的值
			nums[i], nums[match] = nums[match], nums[i]
			reverse(nums, match+1, len(nums)-1)
			return
		}
	}
}

func reverse(nums []int, i, j int) {
	for i < j {
		nums[i], nums[j] = nums[j], nums[i]
		i++
		j--
	}
}
