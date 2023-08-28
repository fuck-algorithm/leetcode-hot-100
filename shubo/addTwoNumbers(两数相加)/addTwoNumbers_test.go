package main

import "testing"

type ListNode struct {
	Val  int
	Next *ListNode
}

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	var ret = &ListNode{}
	var dummy = ret
	flag := false

	for l1 != nil || l2 != nil {
		s := 0
		if l1 != nil {
			s += l1.Val
		}
		if l2 != nil {
			s += l2.Val
		}
		if flag {
			flag = false
			s++
		}
		if s >= 10 {
			flag = true
		}
		dummy.Val = s % 10
		if flag || (l1 != nil && l1.Next != nil) || (l2 != nil && l2.Next != nil) {
			dummy.Next = &ListNode{}
			dummy = dummy.Next
		}
		if l1 != nil {
			l1 = l1.Next
		}
		if l2 != nil {
			l2 = l2.Next
		}
	}
	if flag {
		dummy.Val++
	}
	return ret
}
func TestAddTowNumbers(t *testing.T) {
	t.Log(printListNode(addTwoNumbers(arr2ListNode([]int{9, 9, 9, 9, 9, 9, 9}), arr2ListNode([]int{9, 9, 9, 9}))))
	t.Log(printListNode(addTwoNumbers(arr2ListNode([]int{0}), arr2ListNode([]int{0}))))
	t.Log(printListNode(addTwoNumbers(arr2ListNode([]int{2, 4, 3}), arr2ListNode([]int{5, 6, 4}))))
	t.Log(printListNode(addTwoNumbers(arr2ListNode([]int{9, 9, 1}), arr2ListNode([]int{1}))))

}
func printListNode(l *ListNode) (ret []int) {
	var dummy = l
	if l == nil {
		return
	}
	for dummy != nil {
		ret = append(ret, dummy.Val)
		dummy = dummy.Next
	}
	return
}
func arr2ListNode(arr []int) (ret *ListNode) {
	if len(arr) == 0 {
		return
	}
	ret = &ListNode{Val: arr[0]}
	var dummy = ret
	for _, i := range arr {
		dummy.Next = &ListNode{Val: i}
		dummy = dummy.Next
	}
	return ret.Next
}
func addTwoNumbers2023811(l1 *ListNode, l2 *ListNode) *ListNode {
	var flag bool
	var ret = &ListNode{}
	var cursor = ret
	for {
		if l1 != nil && l2 != nil {
			cursor.Val = l1.Val + l2.Val
			l1 = l1.Next
			l2 = l2.Next
		} else {
			if l1 != nil && l2 == nil {
				cursor.Val = l1.Val
				l1 = l1.Next
			}
			if l2 != nil && l1 == nil {
				cursor.Val = l2.Val
				l2 = l2.Next
			}
		}

		if flag {
			cursor.Val = cursor.Val + 1
		}
		flag = cursor.Val/10 == 1
		cursor.Val %= 10
		if l1 == nil && l2 == nil && !flag {
			return ret
		}
		cursor.Next = &ListNode{}
		cursor = cursor.Next
	}

}
func Test20230811(t *testing.T) {
	t.Log(printListNode(addTwoNumbers2023811(arr2ListNode([]int{9, 9, 9, 9, 9, 9, 9}), arr2ListNode([]int{9, 9, 9, 9}))))
	t.Log(printListNode(addTwoNumbers2023811(arr2ListNode([]int{2, 4, 3}), arr2ListNode([]int{5, 6, 4}))))
}
