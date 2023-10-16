# 206. 反转链表



# 题目

```
https://leetcode.cn/problems/reverse-linked-list/description/
```



# 思路

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func reverseList(head *ListNode) *ListNode {
    var newHead *ListNode 
    for head != nil {
        t := head 
        head = head.Next 
        
        t.Next = newHead 
        newHead = t 
    }
    return newHead 
}
```



