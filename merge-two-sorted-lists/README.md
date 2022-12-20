# 21. 合并两个有序链表

# 题目

```
https://leetcode.cn/problems/merge-two-sorted-lists/description/?favorite=2cktkvj
```

# 思路

从头选取小的合并即可

# 代码

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    answer := &ListNode{}
    result := answer 
    for list1 != nil && list2 != nil {
        nextNode := &ListNode{}
        if list1.Val < list2.Val {
            nextNode.Val = list1.Val 
            list1 = list1.Next 
        } else {
            nextNode.Val = list2.Val 
            list2 = list2.Next 
        }
        result.Next = nextNode 
        result = result.Next 
    }
    for list1 != nil {
        result.Next = &ListNode{Val: list1.Val}
        list1 = list1.Next
        result = result.Next      
    }
    for list2 != nil {
        result.Next = &ListNode{Val: list2.Val}
        list2 = list2.Next   
        result = result.Next       
    }
    return answer.Next 
}
```



