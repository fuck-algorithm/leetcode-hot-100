package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
	var dummy *ListNode

	for head != nil {
		next := head.Next

		head.Next = dummy
		dummy = head
		head = next

	}
	return dummy
}
