package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

var cur = ListNode{}
var head = &ListNode{Next: &cur}

func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
	return recur(list1, list2)
}
func recur(list1 *ListNode, list2 *ListNode) *ListNode {
	if list1 == nil {
		return list2
	}
	if list2 == nil {
		return list1
	}
	if list1.Val < list2.Val {
		list1.Next = recur(list1.Next, list2)
		return list1
	} else {
		list2.Next = recur(list1, list2.Next)
		return list2
	}
}
func main() {
	v := mergeTwoLists(&ListNode{Val: 1, Next: &ListNode{Val: 3, Next: &ListNode{Val: 5}}},
		&ListNode{Val: 2, Next: &ListNode{Val: 4, Next: &ListNode{Val: 6}}})
	fmt.Print(v)
}
