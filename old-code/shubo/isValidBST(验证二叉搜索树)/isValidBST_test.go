package main

import (
	"math"
	"testing"
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func TestIsValidBST(t *testing.T) {
	t.Log(isValidBST(&TreeNode{Val: 2, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}}))
	//t.Log(isValidBST(&TreeNode{Val: 5, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 6, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 7}}}))
}

// dfs 前序遍历。递增则有效
// 中序遍历，空间O(n)
func isValidBST1(root *TreeNode) bool {
	var arr []int
	var rescur func(root *TreeNode)
	rescur = func(root *TreeNode) {
		if root == nil {
			return
		}
		rescur(root.Left)
		arr = append(arr, root.Val)
		rescur(root.Right)
	}
	rescur(root)
	for i := 0; i < len(arr)-1; i++ {
		if arr[i+1] <= arr[i] {
			return false
		}
	}
	return true
}

// 中序遍历，空间O(1)
func isValidBST(root *TreeNode) bool {
	t := math.MinInt
	var rescur func(root *TreeNode) bool
	rescur = func(root *TreeNode) bool {
		if root == nil {
			return true
		}
		if !rescur(root.Left) {
			return false
		}
		if t >= root.Val {
			return false
		}
		t = root.Val
		return rescur(root.Right)
	}
	return rescur(root)
}

//func min(a, b int) int {
//	if a > b {
//		return b
//	}
//	return a
//}
