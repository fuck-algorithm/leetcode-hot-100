package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func isSymmetric(root *TreeNode) bool {
	if root == nil {
		return true
	}

	var dfs func(l *TreeNode, r *TreeNode) bool
	dfs = func(l *TreeNode, r *TreeNode) bool {
		if l == nil && r == nil {
			return true
		}
		if l == nil || r == nil {
			return false
		}
		return l.Val == r.Val && dfs(l.Left, r.Right) && dfs(l.Right, r.Left)
	}
	return dfs(root.Left, root.Right)
}
