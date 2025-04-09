package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

// 妙就妙在 走过你来时的路
func getIntersectionNode(headA, headB *ListNode) *ListNode {
	var dummyA = &ListNode{Next: headA}
	var dummyB = &ListNode{Next: headB}

	for dummyA != dummyB {
		if dummyA == nil {
			dummyA = headB
		} else {
			dummyA = dummyA.Next
		}
		if dummyB == nil {
			dummyB = headA
		} else {
			dummyB = dummyB.Next
		}
	}
	return dummyA
}
func main() {
	a := &ListNode{Val: 3}
	fmt.Println(getIntersectionNode(&ListNode{Val: 2, Next: a}, a))
}
