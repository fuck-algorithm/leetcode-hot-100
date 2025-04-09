package main

func maxSubArray(nums []int) int {
	v := nums[0]
	res := v
	for i := 1; i < len(nums); i++ {
		if v < nums[i] {
			v = nums[i]
		} else {
			v += nums[i]
		}
		res = max(res, v)
	}
	return res
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
