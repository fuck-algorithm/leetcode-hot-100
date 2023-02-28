package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func hasCycle(head *ListNode) bool {
	if head == nil || head.Next == nil {
		return false
	}

	slow := head
	quick := head.Next

	for slow != quick {
		if quick == nil || quick.Next == nil {
			return false
		}
		slow = slow.Next
		quick = quick.Next.Next
	}
	return true
}
