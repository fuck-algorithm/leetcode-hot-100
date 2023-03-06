package main

import "fmt"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func main() {
	fmt.Println(maxDepth(&TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}))
}

func maxDepth(root *TreeNode) int {
	var ret int
	dfs(root, 0, &ret)
	return ret
}
func dfs(root *TreeNode, depth int, maxDepth *int) {
	if root == nil {
		return
	}
	depth++
	*maxDepth = max(depth, *maxDepth)
	dfs(root.Left, depth, maxDepth)
	dfs(root.Right, depth, maxDepth)
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
