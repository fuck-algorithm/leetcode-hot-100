# 543. 二叉树的直径

# 题目

```
https://leetcode.cn/problems/diameter-of-binary-tree/description/
```

# 思路

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func diameterOfBinaryTree(root *TreeNode) int {
    ans = 1 
    if root == nil {
        return 0 
    } 
    countTree(root)
    return ans - 1 
}

var ans int = 0

func countTree(root *TreeNode) int {
    if root == nil {
        return 0 
    } 
    
    L := countTree(root.Left)
    R := countTree(root.Right)

    if 1 + L + R  > ans {
        ans = 1 + L + R  
    }

    if L > R {
        return L + 1 
    } else {
        return R  + 1 
    }
}
```











