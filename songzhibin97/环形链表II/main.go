package main

type ListNode struct {
	Val  int
	Next *ListNode
}

//func detectCycle(head *ListNode) *ListNode {
//	hash := make(map[*ListNode]bool)
//	for head != nil {
//		if hash[head] {
//			return head
//		}
//		hash[head] = true
//		head = head.Next
//	}
//	return nil
//}

func detectCycle(head *ListNode) *ListNode {
	if head == nil {
		return nil
	}
	quick, slow := head, head
	for quick != nil && quick.Next != nil {
		quick = quick.Next.Next
		slow = slow.Next
		if quick == slow {
			break
		}
	}
	if quick == nil || quick.Next == nil {
		return nil
	}
	slow = head
	for slow != quick {
		slow = slow.Next
		quick = quick.Next
	}
	return slow
}
