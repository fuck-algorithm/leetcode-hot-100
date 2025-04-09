# 617. 合并二叉树 

# 题目

```https://leetcode.cn/problems/merge-two-binary-trees/submissions/
https://leetcode.cn/problems/merge-two-binary-trees/description/
```

# 思路

对应位置合并即可 

# 代码

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func mergeTrees(root1 *TreeNode, root2 *TreeNode) *TreeNode {
    answer := &TreeNode{}
    if root1 != nil && root2 != nil {
        answer.Val = root1.Val + root2.Val 
        answer.Left = mergeTrees(root1.Left, root2.Left)
        answer.Right = mergeTrees(root1.Right, root2.Right)
        return answer 
    } else if root1 != nil {
        answer.Val = root1.Val 
        answer.Left = mergeTrees(root1.Left, nil)
        answer.Right = mergeTrees(root1.Right, nil)
        return answer 
    } else if root2 != nil {
        answer.Val = root2.Val 
        answer.Left = mergeTrees(nil, root2.Left)
        answer.Right = mergeTrees(nil, root2.Right)
        return answer 
    } else {
        return nil 
    }
}
```

