package main

import (
	"fmt"
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// 设一个节点有l个左子树，r个右子树
// 则直径为l+r+1
func diameterOfBinaryTree(root *TreeNode) int {
	var ret = 0
	dfs(root, &ret)
	return ret - 1
}

// 后序遍历 统计左右子树的节点

func dfs(root *TreeNode, ret *int) int {
	if root == nil {
		return 0
	}
	l, r := dfs(root.Left, ret), dfs(root.Right, ret)
	*ret = max(*ret, 1+l+r)
	return max(l, r) + 1

}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
func main() {
	fmt.Println(diameterOfBinaryTree(&TreeNode{Val: 1, Right: &TreeNode{Val: 3}, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 5}}}))
}
