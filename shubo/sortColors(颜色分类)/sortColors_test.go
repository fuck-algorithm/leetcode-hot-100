package main

import (
	"fmt"
	"testing"
)

func TestSortColors(t *testing.T) {
	//nums := []int{2, 0, 2, 1, 1, 0}
	nums := []int{1, 0, 1}
	sortColors(nums)
	fmt.Print(nums)
}

// 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
// 我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。
// 必须在不使用库内置的 sort 函数的情况下解决这个问题。

func sortColors(nums []int) {
	i := 0
	j := len(nums) - 1
	for i < j {
		if nums[i] == 0 {
			i++
			continue
		}
		if nums[j] == 2 {
			j--
			continue
		}

		if nums[i] > nums[j] {
			nums[i], nums[j] = nums[j], nums[i]
		} else { // 1,1 1,2 . 找0然后交换
			for k := i; k < j; k++ {
				if nums[k] == 0 {
					nums[i], nums[k] = nums[k], nums[i]
				}
			}
			i++
		}
	}
}
