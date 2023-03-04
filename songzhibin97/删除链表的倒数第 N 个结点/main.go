package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func removeNthFromEnd(head *ListNode, n int) *ListNode {
	dummy := &ListNode{Next: head}

	cur := dummy
	for i := 0; i <= n; i++ {
		cur = cur.Next
	}
	pre := dummy
	for cur != nil {
		cur = cur.Next
		pre = pre.Next
	}
	if pre.Next != nil {
		pre.Next = pre.Next.Next
	}

	return dummy.Next
}
