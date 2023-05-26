package main

import (
	"sort"
	"testing"
)

func TestLongestConsecutive(t *testing.T) {
	//t.Log(longestConsecutive([]int{100, 4, 200, 1, 3, 2}))
	t.Log(longestConsecutive([]int{1, 2, 0, 1}))
}

// 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
// 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

// 时间O(2n),空间O(n)
func longestConsecutive(nums []int) int {
	numSet := map[int]bool{}
	for _, num := range nums {
		numSet[num] = true
	}
	longest := 0
	for num, _ := range numSet {
		// 去除重复情况，快速返回
		if numSet[num-1] {
			continue
		}
		t := num
		cnt := 1
		for numSet[t+1] {
			cnt++
			t++
		}
		longest = max(longest, cnt)
	}
	return longest
}

// 时间O(n logn),空间O(1)
func longestConsecutive1(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	sort.Ints(nums)
	ans := 1
	prev := 1
	for i := 0; i < len(nums)-1; i++ {
		if nums[i+1]-nums[i] == 1 {
			prev++
		} else if nums[i+1] == nums[i] {
			continue
		} else {
			prev = 1
		}
		ans = max(ans, prev)
	}
	return ans
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
