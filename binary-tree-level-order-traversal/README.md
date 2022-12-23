# 102. 二叉树的层序遍历

题目：
```text
https://leetcode.cn/problems/binary-tree-level-order-traversal/description/
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
func levelOrder(root *TreeNode) [][]int {
    if root == nil {
        return nil 
    }
    ans := make([][]int, 0)
    queue := make([]*NodeInfo, 0)
    queue = append(queue, &NodeInfo{node: root, level: 1})
    for len(queue) != 0 {
        nodeInfo := queue[0]
        queue = queue[1:]
        // 把当前节点放入到结果 
        if len(ans) < nodeInfo.level {
            ans = append(ans, make([]int, 0))
        }
        ans[nodeInfo.level-1] = append(ans[nodeInfo.level-1], nodeInfo.node.Val)
        // 左右节点 
        if nodeInfo.node.Left != nil {
            queue = append(queue, &NodeInfo{node: nodeInfo.node.Left, level: nodeInfo.level+1})
        }
        if nodeInfo.node.Right != nil {
            queue = append(queue, &NodeInfo{node: nodeInfo.node.Right, level: nodeInfo.level+1})
        }
    }
    return ans 
}

type NodeInfo struct {
    node *TreeNode
    level int 
}
```

