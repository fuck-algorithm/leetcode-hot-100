package main

import (
	"sort"
	"testing"
)

type ListNode struct {
	Val  int
	Next *ListNode
}

// 思路: 直接根据val排序？有点傻瓜 TODO 还是老老实实写 归并吧
func mergeKLists(lists []*ListNode) *ListNode {
	var l []*ListNode
	var ans *ListNode

	for _, v := range lists {
		cur := v
		for cur != nil {
			l = append(l, cur)
			cur = cur.Next
		}
	}
	sort.Slice(l, func(i, j int) bool {
		return l[i].Val < l[j].Val
	})

	if len(l) == 0 {
		return ans
	}
	ans = l[0]
	cursor := ans
	for i := 1; i < len(l); i++ {
		cursor.Next = l[i]
		cursor = cursor.Next
	}
	cursor.Next = nil
	return ans
}
func TestMergeKLists(t *testing.T) {
	t.Log(mergeKLists([]*ListNode{
		&ListNode{Val: 1, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}},
		&ListNode{Val: 1, Next: &ListNode{Val: 3, Next: &ListNode{Val: 4}}},
		&ListNode{Val: 2, Next: &ListNode{Val: 6}},
	}))
}
