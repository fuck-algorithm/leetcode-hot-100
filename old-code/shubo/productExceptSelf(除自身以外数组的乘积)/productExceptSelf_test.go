package main

import (
	"fmt"
	"testing"
)

func TestProductExceptSelf(t *testing.T) {
	fmt.Println(productExceptSelf([]int{1, 2, 3, 4}))

}

// 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。
// 题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。
// 请不要使用除法，且在 O(n) 时间复杂度内完成此题。
//

// 这样写居然会超时...
func productExceptSelf1(nums []int) []int {
	left := []int{1}
	for i := 1; i < len(nums); i++ {
		left = append(left, left[i-1]*nums[i-1])
	}
	right := []int{1}
	for i := len(nums) - 1; i > 0; i-- {
		right = append([]int{nums[i] * right[0]}, right...)
	}
	var ret []int
	for i := 0; i < len(nums); i++ {
		ret = append(ret, left[i]*right[i])
	}
	return ret
}

// 不让用除法，就记录左右两个方向的累计乘积空间复杂度O(n)
func productExceptSelf(nums []int) []int {
	var ret, left, right = make([]int, len(nums)), make([]int, len(nums)), make([]int, len(nums))
	left[0] = 1
	for i := 1; i < len(nums); i++ {
		left[i] = left[i-1] * nums[i-1]
	}
	right[len(nums)-1] = 1
	for i := len(nums) - 1; i > 0; i-- {
		right[i-1] = nums[i] * right[i]
	}
	for i := 0; i < len(nums); i++ {
		ret[i] = left[i] * right[i]
	}
	return ret
}
