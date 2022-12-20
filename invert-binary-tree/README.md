# 226. 翻转二叉树
题目：
```text
https://leetcode.cn/problems/invert-binary-tree/description/?favorite=2cktkvj
```
代码：
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func invertTree(root *TreeNode) *TreeNode {
    if root == nil {
        return nil 
    }
    ans := &TreeNode{Val: root.Val}
    ans.Left = invertTree(root.Right)
    ans.Right = invertTree(root.Left)
    return ans 
}
```