package main

import "fmt"

func main() {
	var node1 = &ListNode{Val: 1}
	var node2 = &ListNode{Val: 2}
	node2.Next = node1
	node1.Next = node2
	fmt.Println(hasCycle(node1))
	fmt.Println(hasCycle(&ListNode{Val: 1, Next: &ListNode{Val: 2}}))
}

type ListNode struct {
	Val  int
	Next *ListNode
}

func hasCycle(head *ListNode) bool {
	if head == nil || head.Next == nil {
		return false
	}
	slow := head
	fast := head.Next
	for slow != fast {
		if fast == nil || fast.Next == nil {
			return false
		}
		slow = slow.Next
		fast = fast.Next.Next
	}
	return true
}
