package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func buildTree(inorder []int, postorder []int) *TreeNode {
	if len(postorder) == 0 {
		return nil
	}
	root := &TreeNode{Val: postorder[len(postorder)-1]}
	stack := []*TreeNode{root}
	inorderIndex := len(inorder) - 1
	for i := len(postorder) - 2; i >= 0; i-- {
		node := stack[len(stack)-1]
		val := postorder[i]
		if node.Val != inorder[inorderIndex] {
			node.Right = &TreeNode{Val: val}
			stack = append(stack, node.Right)
		} else {
			for len(stack) != 0 && stack[len(stack)-1].Val == inorder[inorderIndex] {
				node = stack[len(stack)-1]
				stack = stack[:len(stack)-1]
				inorderIndex--
			}
			node.Left = &TreeNode{Val: val}
			stack = append(stack, node.Left)
		}
	}
	return root
}
