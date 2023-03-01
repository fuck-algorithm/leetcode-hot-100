package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func getIntersectionNode(headA, headB *ListNode) *ListNode {
	// 快慢指针

	nextA, nextB := headA, headB

	for nextA != nextB {
		if nextA == nil {
			nextA = headB
		} else {
			nextA = nextA.Next
		}
		if nextB == nil {
			nextB = headA
		} else {
			nextB = nextB.Next
		}
	}
	return nextA
}
