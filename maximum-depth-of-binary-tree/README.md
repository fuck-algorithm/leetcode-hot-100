# 104. 二叉树的最大深度

题目：
```text
https://leetcode.cn/problems/maximum-depth-of-binary-tree/description/?favorite=2cktkvj
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
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0 
    }
    left := maxDepth(root.Left)
    right := maxDepth(root.Right)
    if left > right {
        return left + 1 
    } else {
        return right + 1 
    }
}
```