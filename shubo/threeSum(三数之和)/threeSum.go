package main

import (
	"fmt"
	"sort"
)

// 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请
//
// 你返回所有和为 0 且不重复的三元组。
//
// 注意：答案中不可以包含重复的三元组。

// 排序，然后三指针枚举，记录满足条件的结果
// 坑: 枚举过程中，i，j的方向
func threeSum(nums []int) (ret [][]int) {
	if len(nums) < 3 {
		return [][]int{}
	}
	sort.Ints(nums)
	k := 0
	for ; k < len(nums); k++ {
		if nums[k] > 0 {
			break
		}
		if k > 0 && nums[k] == nums[k-1] {
			continue
		}
		i := k + 1
		j := len(nums) - 1
		for i < j {
			t := nums[k] + nums[i] + nums[j]
			if t < 0 {
				i++
				for i < j && nums[i] == nums[i-1] {
					i++
				}
			} else if t > 0 {
				j--
				for i < j && nums[j] == nums[j+1] {
					j--
				}
			} else {
				ret = append(ret, []int{nums[k], nums[i], nums[j]})
				i++
				j--
				for i < j && nums[i] == nums[i-1] {
					i++
				}
				for i < j && nums[j] == nums[j+1] {
					j--
				}
			}

		}

	}
	return
}
func main() {
	//fmt.Println(threeSum([]int{-1, 0, 1, 2, -1, -4}))
	//fmt.Println(threeSum([]int{0, 0, 0}))
	//fmt.Println(threeSum([]int{0, 0, 1}))
	fmt.Println(threeSum([]int{1, -1, -1, 0}))
}
