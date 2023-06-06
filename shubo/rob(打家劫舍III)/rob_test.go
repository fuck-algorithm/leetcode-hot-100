package main

import "testing"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

//小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 root 。
//除了 root 之外，每栋房子有且只有一个“父“房子与之相连。
//一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。
//如果 两个直接相连的房子在同一天晚上被打劫 ，房屋将自动报警。
//给定二叉树的 root 。返回 在不触动警报的情况下 ，小偷能够盗取的最高金额 。

// 思路（错误，无法满足某一个右子树节点的右子树和其父节点的左子树的子树组合的情况）：bfs+贪心.计算每一层的金额总和为一个[]int数组，然后转换为打家劫舍I

// 看了官方题解 https://leetcode.cn/problems/house-robber-iii/solutions/361038/da-jia-jie-she-iii-by-leetcode-solution/?envType=featured-list&envId=2cktkvj
// 设f(o) ,g(o)两个函数分别表示在节点o选中和不被选中时，o的最大权值
// 推出f(o)=g(l)+g(r)
// g(o) = max(f(l),g(l))+max(f(r),g(r))
// 使用hash表记录f(o),g(o)两个函数
// 返回 max(f(root),g(root))
func rob(root *TreeNode) int {
	var f, g = map[*TreeNode]int{}, map[*TreeNode]int{}
	var dfs func(root *TreeNode)
	dfs = func(root *TreeNode) {
		if root == nil {
			return
		}
		if root.Left == nil && root.Right == nil {
			f[root], g[root] = root.Val, 0
			return
		}
		dfs(root.Left)
		dfs(root.Right)
		f[root] = root.Val + g[root.Left] + g[root.Right]
		g[root] = max(f[root.Left], g[root.Left]) + max(f[root.Right], g[root.Right])
		return
	}
	dfs(root)
	return max(f[root], g[root])
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
func TestRob(t *testing.T) {
	t.Log(rob(&TreeNode{Val: 3, Left: &TreeNode{Val: 2, Right: &TreeNode{Val: 3}}, Right: &TreeNode{Val: 3, Right: &TreeNode{Val: 1}}}))
}
