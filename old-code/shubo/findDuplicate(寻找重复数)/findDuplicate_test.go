package main

import "testing"

// 给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。
//
// 假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。
//
// 你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。

// 这题巧在 nums 长度为n+1,取值在[1,n]之间，恰巧有一个值重复两次
// 又看了题解，这题当环形链表II来处理,环的入口就是重复的值
func findDuplicate(nums []int) int {
	// 结合 环形链表II 当快慢指针相遇时，快慢指针改为一个从开头，一个从相遇点。每次都只移动一个节点。再次相遇就是环入口
	slow, fast := nums[0], nums[nums[0]]
	for slow != fast {
		slow = nums[slow]
		fast = nums[nums[fast]]
	}
	fast = 0
	for slow != fast {
		slow = nums[slow]
		fast = nums[fast]
	}
	return fast
}
func TestFindDuplicate(t *testing.T) {
	t.Log(findDuplicate([]int{1, 3, 4, 2, 2}))
}
