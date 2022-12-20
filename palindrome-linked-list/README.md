# 234. 回文链表

题目：
```text
https://leetcode.cn/problems/palindrome-linked-list/description/?favorite=2cktkvj
```
代码：
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
