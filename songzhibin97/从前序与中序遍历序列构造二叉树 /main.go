package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func buildTree(preorder []int, inorder []int) *TreeNode {
	if len(preorder) == 0 {
		return nil
	}
	root := &TreeNode{Val: preorder[0]}
	stack := []*TreeNode{root}
	inorderIndex := 0
	for i := 1; i < len(preorder); i++ {
		node := stack[len(stack)-1]
		preorderValue := preorder[i]
		if node.Val != inorder[inorderIndex] {
			node.Left = &TreeNode{Val: preorderValue}
			stack = append(stack, node.Left)
		} else {
			for len(stack) != 0 && stack[len(stack)-1].Val == inorder[inorderIndex] {
				node = stack[len(stack)-1]
				stack = stack[:len(stack)-1]
				inorderIndex++
			}
			node.Right = &TreeNode{Val: preorderValue}
			stack = append(stack, node.Right)
		}
	}
	return root
}
