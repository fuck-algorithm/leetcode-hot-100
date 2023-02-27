# 94. 二叉树的中序遍历

题目：

```
https://leetcode.cn/problems/binary-tree-inorder-traversal/description/?favorite=2cktkvj
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
func inorderTraversal(root *TreeNode) []int {
    if root == nil {
        return nil 
    }
    answer := make([]int, 0)
    answer = append(answer, inorderTraversal(root.Left)...)
    answer = append(answer, root.Val)
    answer = append(answer, inorderTraversal(root.Right)...)
    return answer 
}
```





