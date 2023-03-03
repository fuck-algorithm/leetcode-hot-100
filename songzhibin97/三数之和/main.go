package main

import (
	"fmt"
	"sort"
)

func threeSum(nums []int) [][]int {
	res := make([][]int, 0)
	sort.Ints(nums)
	for i, num := range nums {
		if i != 0 && nums[i-1] == num {
			continue
		}
		target := -num
		left, right := i+1, len(nums)-1
		for left < right {

			for left < right && left > i+1 && nums[left] == nums[left-1] {
				left++
			}
			for right > left && right < len(nums)-1 && nums[right] == nums[right+1] {
				right--
			}
			if left >= right {
				break
			}
			vs := nums[left] + nums[right]
			if vs == target {
				res = append(res, []int{num, nums[left], nums[right]})
				left++
				right--
				continue
			}
			if vs > target {
				right--
			} else {
				left++
			}
		}
	}
	return res
}

func main() {
	fmt.Println(threeSum([]int{0, 0, 0, 0, 0, 0, 0}))
}
