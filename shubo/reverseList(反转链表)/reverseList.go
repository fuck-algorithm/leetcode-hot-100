package main

import "fmt"

func main() {
	//printList(reverseList(&ListNode{Val: 1, Next: &ListNode{Val: 2}}))
	printList(reverseBetween(&ListNode{Val: 3, Next: &ListNode{Val: 5}}, 1, 2))
	printList(reverseBetween(&ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}}}}, 2, 4))
	printList(reverseBetween(&ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}}}}, 3, 4))
}

type ListNode struct {
	Val  int
	Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	t := reverseList(head.Next)
	head.Next.Next = head // 翻转当前函数栈节点的后继的后继
	head.Next = nil       // 当前函数栈节点的后继置空
	return t              // 返回函数栈顶的节点
}
func printList(head *ListNode) {
	for head != nil {
		fmt.Println(head.Val)
		head = head.Next
	}
	fmt.Println("---------")
	return
}

/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
// 将链表分为三部分。
// left前的最后一个node 叫做a
// left，right之间计作d
// right之后计作c
// 记录b的头节点为d
// 反转d 计作b
// a->b
// d->c
// 返回 head
func reverseBetween(head *ListNode, left int, right int) *ListNode {
	if head == nil || left == right {
		return head
	}
	var reverse func(head *ListNode) *ListNode
	reverse = func(head *ListNode) *ListNode {
		if head == nil || head.Next == nil {
			return head
		}
		r := reverse(head.Next)
		head.Next.Next = head
		head.Next = nil
		return r
	}
	cursor := head
	var a, b, c, d *ListNode
	a = nil
	d = head
	idx := 1
	for cursor != nil && cursor.Next != nil {
		if idx+1 == left {
			d = cursor.Next
			a = cursor
		}
		if idx == right {
			c = cursor.Next
			cursor.Next = nil
		}
		idx++
		cursor = cursor.Next
	}
	b = reverse(d)
	if left == 1 {
		head = b
	} else {
		if a != nil {
			a.Next = b
		}
	}

	if d != nil {
		d.Next = c
	}
	return head
}
