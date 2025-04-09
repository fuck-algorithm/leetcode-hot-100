package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

//https://leetcode.cn/problems/path-sum-iii/?envType=featured-list&envId=2cktkvj
//给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
//
//路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
//输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
//输出：3
//解释：和等于 8 的路径有 3 条

// 思路：
//  1. 先求以某一个节点为根的情况下，满足sum == targetSum的路径数。
//  2. 便利所有节点为根，累加路径数
func pathSum(root *TreeNode, targetSum int) int {
	var (
		dfs func(root *TreeNode, targetSum int) int
		ans = 0
	)
	dfs = func(root *TreeNode, targetSum int) int {
		var cnt int
		if root == nil {
			return 0
		}
		if root.Val == targetSum {
			cnt++
		}
		cnt += dfs(root.Left, targetSum-root.Val)
		cnt += dfs(root.Right, targetSum-root.Val)

		return cnt
	}
	if root == nil {
		return 0
	}
	ans = dfs(root, targetSum)
	ans += pathSum(root.Left, targetSum)
	ans += pathSum(root.Right, targetSum)
	return ans
}

// 前缀和
// 如果在前缀路径和中发现有值为curPathSum-target的（可能会>1，即多条前缀路径）
// 那么路径和为curPathSum的路径的最后一个节点的下一个节点到当前节点的和等于targe（画个图就知道了）
//
//	   root->  o 10               prefixSumCount有 10:1 15:1
//	           |                     curPathSum  为  18
//	           o 5              curPathSum-target 为 18-8 = 10
//	          /              因此路径和为10的路径的最后一个节点（10）的下一个节
//	cur->    o 3             点（5）到cur（3）为一条满足和为target（8）的路径
//
// 套模板
// 记录从root节点到当前节点的currSum值
// 如果在root到node之间存在节点i，节点i到root的前缀和为currSum - targetSum，
//
//	并且在前缀和表中出现过，则节点i+1到node的路径一定存在和为targetSum的路径
//
// 初始 hash= {0:1}
func pathSum1(root *TreeNode, targetSum int) int {
	var hash = map[int]int{0: 1}
	var dfs func(root *TreeNode, currSum int)
	var ans = 0
	dfs = func(root *TreeNode, currSum int) {
		if root == nil {
			return
		}
		currSum += root.Val
		ans += hash[currSum-targetSum]
		hash[currSum]++
		dfs(root.Left, currSum)
		dfs(root.Right, currSum)
		hash[currSum]--
		return
	}
	dfs(root, 0)
	return ans
}
