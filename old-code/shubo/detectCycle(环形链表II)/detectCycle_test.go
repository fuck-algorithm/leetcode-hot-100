package main

import "testing"

type ListNode struct {
	Val  int
	Next *ListNode
}

// 给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
//
// 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
// 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。
// 如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
//
// 不允许修改 链表。

// 直接hash,但这题要O(1)
//func detectCycle(head *ListNode) *ListNode {
//	var hash = map[*ListNode]bool{}
//	cursor := head
//	for cursor != nil {
//		if hash[cursor] {
//			return cursor
//		}
//		hash[cursor] = true
//		cursor = cursor.Next
//	}
//	return nil
//}

// 快慢指针
// 设入口前有a个节点，后有b个节点
// 第一次相遇时，s为慢指针步数，则快指针f=2s
// f一定是比a多走了n个b才能重合，因此=> f=s+n*b
// 综上 s = n*b
// 结果是要求a是多少
// 已知 慢指针的步数k=a+nb
// a= k-nb ,又因为s=nb
// 所以 此时只需要再来一个指针偏移a个位置，向后和慢指针一同移动，就能将a约掉。相遇时就是入口节点。
// 此偏移可以直接取head节点
func detectCycle(head *ListNode) *ListNode {
	var fast, slow = head, head
	for {
		if slow == nil || fast == nil || fast.Next == nil {
			return nil
		}
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			break
		}
	}
	fast = head
	for slow != fast {
		fast = fast.Next
		slow = slow.Next
	}
	return fast
}

//func TestDetectCycle(t *testing.T) {
//	node4 := &ListNode{Val: -4}
//	node3 := &ListNode{Val: 0, Next: node4}
//	node2 := &ListNode{Val: 2, Next: node3}
//	node1 := &ListNode{Val: 3, Next: node2}
//	node4.Next = node2
//	t.Log(detectCycle(node1))
//}

func TestDetectCycle1(t *testing.T) {
	node1 := &ListNode{Val: 1}
	node2 := &ListNode{Val: 2, Next: node1}
	node1.Next = node2
	t.Log(detectCycle(node1))
}
