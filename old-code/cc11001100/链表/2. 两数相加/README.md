# 2. 两数相加

# 题目

```
https://leetcode.cn/problems/add-two-numbers/?favorite=2cktkvj
```

# 思路

逐位相加进位即可

# 代码

```text 
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    fakeHead := &ListNode{}
    currentNode := fakeHead
    carry := 0 
    for l1 != nil || l2 != nil {
        r1 := carry 
        if l1 != nil {
            r1 += l1.Val 
            l1 = l1.Next 
        }
        if l2 != nil {
            r1 += l2.Val 
            l2 = l2.Next 
        }
        carry = r1 / 10 
        r1 = r1 % 10 
        currentNode.Next = &ListNode{Val: r1}
        currentNode = currentNode.Next 
    }
    if carry != 0 {
        currentNode.Next = &ListNode{Val: carry}
    }
    return fakeHead.Next 
}
```

