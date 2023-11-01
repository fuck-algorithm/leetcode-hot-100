# 141. 环形链表

# 题目

```text
https://leetcode.cn/problems/linked-list-cycle/
```

# 思路

先他妈map一把梭，过一次再说

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func hasCycle(head *ListNode) bool {
// 管他妈，先来个map一把梭 
m := make(map[*ListNode]struct{}, 0)
for head != nil {
if _, exists := m[head]; exists {
return true
}
m[head] = struct{}{}
head = head.Next
}
return false
}
```

快慢指针，有情人终会相遇：

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func hasCycle(head *ListNode) bool {
    fast := head 
    slow := head 
    for slow != nil && fast != nil { 
        fast = fast.Next 
        if fast == nil {
            return false 
        } else if fast == slow {
            return true 
        }
        fast = fast.Next
        if fast == nil {
            return false 
        } else if fast == slow {
            return true 
        }
        slow = slow.Next
    }
    return false 
}
```

