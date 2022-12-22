# 23. 合并K个升序链表

题目：
```text 
https://leetcode.cn/problems/merge-k-sorted-lists/description/?favorite=2cktkvj
```
代码：
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeKLists(lists []*ListNode) *ListNode {
    fakeHead := &ListNode{}
    currentNode := fakeHead 
    for {
        // 从这些链表中找到一个最小的值
        minValue := 999999
        minValueIndex := -1 
        for index, l := range lists {
            if l != nil  {
                if l.Val < minValue {
                    minValue = l.Val 
                    minValueIndex = index 
                } 
            }
        }
        if minValueIndex == -1 {
            break 
        }
        currentNode.Next = &ListNode{Val:minValue}
        currentNode = currentNode.Next 
        lists[minValueIndex] = lists[minValueIndex].Next 
    }
    return fakeHead.Next 
}
```
