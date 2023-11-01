# 94. 二叉树的中序遍历

## 题目

```
https://leetcode.cn/problems/binary-tree-inorder-traversal/description/?favorite=2cktkvj
```

给定一个二叉树的根节点 `root` ，返回 *它的 **中序** 遍历* 。

**示例 1：**

![img](README.assets/inorder_1.jpg)

```
输入：root = [1,null,2,3]
输出：[1,3,2]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [1]
输出：[1]
```

 **提示：**

- 树中节点数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

**进阶:** 递归算法很简单，你可以通过迭代算法完成吗？

## 方法一：递归

没啥好说的，递归即可： 

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

## 方法二：迭代

使用一个队列来存储： 

代码：

```go

```





