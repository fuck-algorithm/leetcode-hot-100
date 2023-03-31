package main

type ListNode struct {
	Val  int
	Next *ListNode
}

// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
// 双指针。先让第一个指针超前n个节点，然后第一个指针到链表末尾时，第二个指针刚好就是倒数第n个。
// 跳过一个节点即可
func removeNthFromEnd(head *ListNode, n int) *ListNode {
	dummy := &ListNode{0, head}
	first, second := head, dummy
	for i := 0; i < n; i++ {
		first = first.Next
	}
	for first != nil {
		first = first.Next
		second = second.Next
	}
	second.Next = second.Next.Next
	return dummy.Next
}
