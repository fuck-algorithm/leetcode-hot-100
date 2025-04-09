package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	dummy := &ListNode{}
	head := dummy
	val := 0
	for l1 != nil || l2 != nil || val != 0 {
		head.Next = &ListNode{}
		head = head.Next
		head.Val = val
		val = 0
		if l1 != nil {
			head.Val += l1.Val
			l1 = l1.Next
		}
		if l2 != nil {
			head.Val += l2.Val
			l2 = l2.Next
		}
		if head.Val > 9 {
			val = 1
			head.Val -= 10
		}
	}

	return dummy.Next
}
