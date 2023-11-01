# 234. 回文链表

# 一、题目描述

题目：
```text
https://leetcode.cn/problems/palindrome-linked-list/description
```


给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。

 

**示例 1：**

![img](README.assets/pal1linked-list.jpg)

```
输入：head = [1,2,2,1]
输出：true
```

**示例 2：**

![img](README.assets/pal2linked-list.jpg)

```
输入：head = [1,2]
输出：false
```

 

**提示：**

- 链表中节点数目在范围`[1, 105]` 内
- `0 <= Node.val <= 9`

 

**进阶：**你能否用 `O(n)` 时间复杂度和 `O(1)` 空间复杂度解决此题？



# 二、思路







# 三、AC代码

## 3.1 Golang

递归： 

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func isPalindrome(head *ListNode) bool {
    _, ans := f(head, head)    
    return ans 
}

func f(compare, now *ListNode) (*ListNode, bool) {
    if now.Next != nil {
        var equals bool 
        compare, equals = f(compare, now.Next)
        if !equals {
            return nil, equals 
        }
    }
    return compare.Next, compare.Val == now.Val 
}
```
栈：
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func isPalindrome(head *ListNode) bool {
    // 栈 
    stack := make([]*ListNode, 0)
    currentNode := head 
    for currentNode != nil {
        stack = append(stack, currentNode)
        currentNode = currentNode.Next 
    }
    currentNode = head 
    for currentNode != nil {
        stackPop := stack[len(stack)-1]
        stack = stack[0:len(stack)-1]
        if currentNode.Val != stackPop.Val {
            return false 
        }
        currentNode = currentNode.Next 
    }
    return true 
}
```
