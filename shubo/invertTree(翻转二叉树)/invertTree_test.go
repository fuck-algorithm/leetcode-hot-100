package main

import "testing"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func invertTree(root *TreeNode) *TreeNode {
	dfs(root)
	return root
}

// 二叉树，手熟尔
func dfs(root *TreeNode) {
	if root == nil {
		return
	}
	root.Left, root.Right = root.Right, root.Left
	dfs(root.Right)
	dfs(root.Left)
	return
}
func TestName(t *testing.T) {
	root1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	invertTree(root1)
}
