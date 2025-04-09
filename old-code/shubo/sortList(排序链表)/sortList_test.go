package main

import "testing"

type ListNode struct {
	Val  int
	Next *ListNode
}

// 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。

// 归并排序

func sortList(head *ListNode) *ListNode {

	return mergeSort(head)
}

// 先使用快慢指针找到mid
// 递归二分
//
//	递归结束条件: 分到了最后一轮，即head没有后继
//	比较左右分区的头节点值
//	合并左右分区两个有序链表
func dividedListNode(head *ListNode) (l, r *ListNode) {
	slow := head
	midPrev := head
	fast := head
	for fast != nil && fast.Next != nil {
		midPrev = slow
		slow = slow.Next
		fast = fast.Next.Next
	}
	midPrev.Next = nil
	return head, slow
}
func TestDivided(t *testing.T) {
	l, r := dividedListNode(&ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}}}})
	t.Log(l)
	t.Log(r)
}
func TestMergeSort(t *testing.T) {
	//root := mergeSort(&ListNode{Val: 5, Next: &ListNode{Val: 4, Next: &ListNode{Val: 3, Next: &ListNode{Val: 2, Next: &ListNode{Val: 1}}}}})
	root := mergeSort(&ListNode{Val: 4, Next: &ListNode{Val: 2, Next: &ListNode{Val: 1, Next: &ListNode{Val: 3}}}})
	t.Log(root)
}
func mergeSort(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	le, ri := dividedListNode(head)
	l := mergeSort(le)
	r := mergeSort(ri)
	return mergeOrderedList(r, l)
}

// 合并两个有序链表
func mergeOrderedList(list1, list2 *ListNode) *ListNode {
	if list1 == nil {
		return list2
	}
	if list2 == nil {
		return list1
	}
	if list1.Val < list2.Val {
		list1.Next = mergeOrderedList(list1.Next, list2)
		return list1
	} else {
		list2.Next = mergeOrderedList(list1, list2.Next)
		return list2
	}
}
