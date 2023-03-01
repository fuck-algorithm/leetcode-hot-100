package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func isPalindrome(head *ListNode) bool {
	if head == nil {
		return true
	}
	slow, quick := head, head
	for quick != nil && quick.Next != nil {
		slow = slow.Next
		quick = quick.Next.Next
	}
	// middle slow
	nx := reverseList(slow)
	for nx != nil {
		if nx.Val != head.Val {
			return false
		}
		nx = nx.Next
		head = head.Next
	}
	return true
}

func reverseList(head *ListNode) *ListNode {
	var dummy *ListNode

	for head != nil {
		next := head.Next

		head.Next = dummy
		dummy = head
		head = next

	}
	return dummy
}

func main() {
	isPalindrome(&ListNode{
		Val: 1,
		Next: &ListNode{
			Val: 1,
			Next: &ListNode{
				Val:  2,
				Next: &ListNode{Val: 1},
			},
		},
	})
}
