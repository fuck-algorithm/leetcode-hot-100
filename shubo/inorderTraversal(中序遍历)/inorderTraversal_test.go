package main

import "testing"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func inorderTraversal(root *TreeNode) []int {
	var ret []int
	dfs(root, &ret)
	return ret
}
func dfs(root *TreeNode, ret *[]int) {
	if ret == nil {
		return
	}
	if root == nil {
		return
	}
	dfs(root.Left, ret)
	*ret = append(*ret, root.Val)
	dfs(root.Right, ret)
}
func TestInorderTraversal(t *testing.T) {
	root1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	t.Log(inorderTraversal(root1))

}
