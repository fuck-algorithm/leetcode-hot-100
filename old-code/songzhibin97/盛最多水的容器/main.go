package main

func maxArea(height []int) int {
	left, right := 0, len(height)-1
	res := 0
	for left < right {
		res = max(res, min(height[left], height[right])*(right-left))
		if height[left] > height[right] {
			right--
		} else {
			left++
		}
	}
	return res
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
