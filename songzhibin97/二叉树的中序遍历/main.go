package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func inorderTraversal(root *TreeNode) []int {
	res := []int{}
	var dfs func(r *TreeNode)
	dfs = func(r *TreeNode) {
		if r == nil {
			return
		}
		dfs(r.Left)
		res = append(res, r.Val)
		dfs(r.Right)
	}
	dfs(root)

	return res
}
