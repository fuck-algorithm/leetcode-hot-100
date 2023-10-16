# 160. 相交链表

# 题目

```
https://leetcode.cn/problems/intersection-of-two-linked-lists/solutions/
```

# 思路

先把尾部对齐，然后再进行比较，但是时间复杂度是`O(n) + O(m) + O(max(n, m))`： 

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getIntersectionNode(headA, headB *ListNode) *ListNode {

    // 朴素的想法，先将两个链表从尾部对齐，然后再比较 

    lengthA := 0 
    tempHeadA := headA 
    for tempHeadA != nil {
        lengthA++ 
        tempHeadA = tempHeadA.Next 
    }

    lengthB := 0 
    tempHeadB := headB 
    for tempHeadB != nil {
        lengthB++ 
        tempHeadB = tempHeadB.Next 
    }

    if lengthA > lengthB {
        for i:=lengthA-lengthB; i>0 && headA!=nil; i-- {
            headA = headA.Next 
        }
    } else {
        for i:=lengthB-lengthA; i>0 && headB!=nil; i-- {
            headB = headB.Next 
        }
    }

    for headA != nil && headB != nil {
        if headA == headB {
            return headA 
        }
        headA = headA.Next 
        headB = headB.Next 
    }
    return nil  
}
```



更优解，互相交换啥的....















