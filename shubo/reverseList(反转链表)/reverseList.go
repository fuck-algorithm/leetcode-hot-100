package main

import "fmt"

func main() {
	printList(reverseList(&ListNode{Val: 1, Next: &ListNode{Val: 2}}))
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
	return
}
