# 21. 合并两个有序链表

# 一、题目描述

题目链接：

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

# 二、思路

1. 当两个链表都不为空的时候，从两个链表的头部选择更小的那个值加入到新的链表，一直重复这个步骤直到某个链表为空
2. 然后把不为空的那个链表剩下的元素都追加到新的链表的尾部

# 三、AC代码

## 3.1 Golang

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    newList := &ListNode{}
    tail := newList 
    
    // 从两个列表的头部选择较小的元素 
    for list1 != nil && list2 != nil {
        if list1.Val < list2.Val {
            tail.Next = &ListNode{
                Val: list1.Val,
            }
            tail = tail.Next 
            list1 = list1.Next 
        } else {
            tail.Next = &ListNode{
                Val: list2.Val,
            }
            tail = tail.Next 
            list2 = list2.Next 
        }
    }
    
    // 把可能的剩下的元素追加到新列表的尾部 
    for list1 != nil {
        tail.Next = &ListNode{
            Val: list1.Val,
        }
        tail = tail.Next 
        list1 = list1.Next 
    }
    for list2 != nil {
        tail.Next = &ListNode{
            Val: list2.Val, 
        }
        tail = tail.Next 
        list2 = list2.Next 
    }
    return newList.Next 
}
```



