package main

import "sort"

type ListNode struct {
	Val  int
	Next *ListNode
}

// TODO 傻逼解法

func sortList(head *ListNode) *ListNode {
	list := []int{}
	for head != nil {
		list = append(list, head.Val)
		head = head.Next
	}

	sort.Ints(list)

	dummy := &ListNode{}
	vs := dummy
	for _, v := range list {
		vs.Next = &ListNode{
			Val: v,
		}
	}
	return dummy.Next
}
