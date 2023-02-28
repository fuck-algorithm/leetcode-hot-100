package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
	dummy := &ListNode{}
	head := dummy
	for list1 != nil || list2 != nil {
		if list1 == nil || (list2 != nil && list1.Val > list2.Val) {
			dummy.Next = list2
			list2 = list2.Next
		} else {
			dummy.Next = list1
			list1 = list1.Next
		}
		dummy = dummy.Next
	}
	return head.Next
}
