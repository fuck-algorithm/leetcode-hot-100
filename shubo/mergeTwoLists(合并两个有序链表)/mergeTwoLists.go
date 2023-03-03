package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

var cur = ListNode{}
var head = &ListNode{Next: &cur}

func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
	return rescur(list1, list2)
}
func rescur(list1 *ListNode, list2 *ListNode) *ListNode {
	if list1 == nil && list2 == nil {
		return nil
	}
	if list1 == nil {
		return list2
	}
	if list2 == nil {
		return list1
	}
	if list1.Val > list2.Val {
		cur.Next = rescur(list1, list2.Next)
	} else {
		cur.Next = rescur(list1.Next, list2)
	}

	return &cur
}
func main() {
	v := mergeTwoLists(&ListNode{Val: 1, Next: &ListNode{Val: 3, Next: &ListNode{Val: 5}}},
		&ListNode{Val: 2, Next: &ListNode{Val: 4, Next: &ListNode{Val: 6}}})
	fmt.Print(v)
}
