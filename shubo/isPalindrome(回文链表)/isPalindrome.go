package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

// 链表元素复制到数组
// 双指针读数组判断回文
func isPalindromeArr(head *ListNode) bool {
	arr := transList2Array(head)
	i := 0
	j := len(arr) - 1
	for i < j {
		if arr[i] != arr[j] {
			return false
		}
		i++
		j--
	}
	return true
}
func transList2Array(head *ListNode) []int {
	dummy := head
	var ret []int
	for dummy != nil {
		ret = append(ret, dummy.Val)
		dummy = dummy.Next
	}
	return ret
}

// 1. 找到链表的前半部分 (快慢指针)
// 2. 翻转链表后半部分 (递归，栈迭代都行)
// 3. 比较节点值
func isPalindrome(head *ListNode) bool {
	midIdx, mid := findMiddleNode(head)
	dummyHead := head
	dummyMid := reverseList(mid)
	for i := 0; i < midIdx; i++ {
		if dummyHead.Val != dummyMid.Val {
			return false
		}
		dummyHead = dummyHead.Next
		dummyMid = dummyMid.Next
	}
	return true
}
func findMiddleNode(head *ListNode) (int, *ListNode) {
	fast := head
	slow := head
	midIndex := 0
	for fast != nil && fast.Next != nil {
		midIndex++
		fast = fast.Next.Next
		slow = slow.Next
	}
	return midIndex, slow
}
func reverseList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	t := reverseList(head.Next)
	head.Next.Next = head
	head.Next = nil
	return t
}
func main() {
	fmt.Println(isPalindrome(&ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 2, Next: &ListNode{Val: 1}}}}))
	fmt.Println(isPalindromeArr(&ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 2, Next: &ListNode{Val: 1}}}}))
}
