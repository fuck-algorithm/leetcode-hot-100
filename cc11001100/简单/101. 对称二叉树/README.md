# 101. 对称二叉树

题目：
```text
https://leetcode.cn/problems/symmetric-tree/description/?favorite=2cktkvj
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
func isSymmetric(root *TreeNode) bool {
    if root == nil {
        return true 
    }
    return isMirror(root.Left, root.Right); 
}

func isMirror(a, b *TreeNode) bool {
    if a == nil || b == nil {
        return a == b 
    }
    if a.Val != b.Val {
        return false 
    }
    return isMirror(a.Left, b.Right) && isMirror(a.Right, b.Left)
}

```