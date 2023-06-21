package main

import "math"

//二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
//路径和 是路径中各节点值的总和。
//给你一个二叉树的根节点 root ，返回其 最大路径和 。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

// 输入：root = [1,2,3]
// 输出：6
// 解释：最优路径是 2 -> 1 -> 3 ，路径和为 2 + 1 + 3 = 6
type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// 思路：
// 考虑一颗最小的二叉树
// 最优路径 是取 左子树或右子树中贡献最大的那一个 加上 根节点的值。
// 递归的 返回是每一次的贡献值，如果这个值是个负数，则直接返回0。其实就是不走这个根节点
func maxPathSum(root *TreeNode) int {
	var ans = math.MinInt64
	var dfs func(root *TreeNode) int
	dfs = func(root *TreeNode) int {
		if root == nil {
			return 0
		}
		left := dfs(root.Left)
		right := dfs(root.Right)
		currMaxAns := left + root.Val + right
		ans = max(ans, currMaxAns)
		returnAns := root.Val + max(left, right)
		return max(returnAns, 0)
	}
	dfs(root)
	return ans
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
