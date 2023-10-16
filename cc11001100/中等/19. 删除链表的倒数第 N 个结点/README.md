# 19. 删除链表的倒数第 N 个结点

https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/

双指针： 
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    slow := &ListNode{
        Next: head, 
    } 
    ans := slow 
    fast := head 
    for n > 0 && fast != nil {
        fast = fast.Next 
        n-- 
    }
    // 链表中的元素不够删除的 
    if n != 0 {
        return head 
    }
    for fast != nil {
        fast = fast.Next 
        slow = slow.Next 
    }

    if slow != nil && slow.Next != nil {
        t := slow.Next 
        slow.Next = slow.Next.Next 
        t.Next = nil 
    }

    return ans.Next 
}
```

