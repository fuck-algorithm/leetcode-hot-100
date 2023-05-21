package main

import (
	"testing"
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// 给你二叉树的根结点 root ，请你将它展开为一个单链表：
// 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
// 展开后的单链表应该与二叉树 先序遍历 顺序相同。

// 这种方式会 空间复杂度 o(n) out of memory
func flattenOOM(root *TreeNode) {
	var nodes []*TreeNode
	var dfs func(root *TreeNode)
	dfs = func(root *TreeNode) {
		if root == nil {
			return
		}
		nodes = append(nodes, root)
		dfs(root.Left)
		dfs(root.Right)
	}
	dfs(root)
	var cursor = root
	for _, node := range nodes {
		cursor.Right = node
		cursor.Left = nil
		cursor = cursor.Right
	}
	return
}

// 空间O(1)的实现思路：dfs每一个根结点。使左子树的节点移动到根结点和右子树之间。
func flatten(root *TreeNode) {
	if root == nil {
		return
	}

	flatten(root.Left)
	flatten(root.Right)
	// 将左子树节点移动到根结点与右子树之间
	if root.Left == nil {
		return
	}
	r := root.Right
	root.Right = root.Left
	root.Left = nil
	cursor := root.Right
	for cursor.Right != nil {
		cursor = cursor.Right
	}
	cursor.Right = r
	return
}
func TestFlatten(t *testing.T) {
	//flatten(&TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 4}}, Right: &TreeNode{Val: 5, Right: &TreeNode{Val: 6}}})
	r := &TreeNode{Val: 1, Right: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	flatten(r)
	t.Log()
}
