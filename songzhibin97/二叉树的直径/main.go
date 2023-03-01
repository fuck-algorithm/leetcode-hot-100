package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func diameterOfBinaryTree(root *TreeNode) int {
	//        root
	//      /     \
	//    left  right
	// left max + right max
	var dfsEdge func(root *TreeNode) int
	dfsEdge = func(root *TreeNode) int {
		if root == nil {
			return 0
		}
		return max(dfsEdge(root.Left), dfsEdge(root.Right)) + 1
	}
	var res int
	var dfs func(root *TreeNode)
	dfs = func(root *TreeNode) {
		if root == nil {
			return
		}
		dfs(root.Left)
		res = max(res, dfsEdge(root.Left)+dfsEdge(root.Right))
		dfs(root.Right)
	}
	dfs(root)
	return res
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
