package main

import "math"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func isValidBST(root *TreeNode) bool {
	var dfs func(root *TreeNode, max, min int) bool
	dfs = func(root *TreeNode, max, min int) bool {
		if root == nil {
			return true
		}
		if root.Val >= max || root.Val <= min {
			return false
		}
		return dfs(root.Left, root.Val, min) && dfs(root.Right, max, root.Val)
	}
	return dfs(root, math.MaxInt, math.MinInt)
}
