package main

import "testing"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func TestBuildTree(t *testing.T) {
	//preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
	r := buildTree([]int{3, 9, 20, 15, 7}, []int{9, 3, 15, 20, 7})
	t.Log(r)
}
func buildTree(preorder []int, inorder []int) *TreeNode {
	if len(preorder) == 0 || len(inorder) == 0 {
		return nil
	}

	var recur func(preorder []int, inorder []int) *TreeNode
	recur = func(preorder []int, inorder []int) (root *TreeNode) {
		if len(preorder) == 0 || len(inorder) == 0 {
			return
		}
		root = &TreeNode{Val: preorder[0]}
		var leftSubTreeNodes int
		for i, val := range inorder {
			if val == preorder[0] {
				leftSubTreeNodes = i
			}
		}
		root.Left = recur(preorder[1:1+leftSubTreeNodes], inorder[:leftSubTreeNodes+1])
		root.Right = recur(preorder[leftSubTreeNodes+1:], inorder[leftSubTreeNodes+1:])
		return
	}

	return recur(preorder, inorder)
}
