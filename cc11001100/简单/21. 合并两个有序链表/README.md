# 21. 合并两个有序链表

## 题目

```
https://leetcode.cn/problems/merge-two-sorted-lists/description/?favorite=2cktkvj
```

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

 **示例 1：**

![img](README.assets/merge_ex1.jpg)

```
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
```

**示例 2：**

```
输入：l1 = [], l2 = []
输出：[]
```

**示例 3：**

```
输入：l1 = [], l2 = [0]
输出：[0]
```

 **提示：**

- 两个链表的节点数目范围是 `[0, 50]`
- `-100 <= Node.val <= 100`
- `l1` 和 `l2` 均按 **非递减顺序** 排列

## 思路

从头选取小的合并即可，只是需要注意进位 

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



