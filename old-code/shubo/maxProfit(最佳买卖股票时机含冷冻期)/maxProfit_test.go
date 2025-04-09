package main

// 给定一个整数数组prices，其中第  prices[i] 表示第 i 天的股票价格 。​
//
// 设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）:
//
// 卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。
// 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
// 输入: prices = [1,2,3,0,2]
// 输出: 3
// 解释: 对应的交易状态为: [买入, 卖出, 冷冻期, 买入, 卖出]
// 官方题解：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/solutions/323509/zui-jia-mai-mai-gu-piao-shi-ji-han-leng-dong-qi-4/?envType=featured-list&envId=2cktkvj
// DP
// f[i] 表示第i天结束后的累计最大收益
// 根据题意，会有以下三种状态(以一个新的维度表示)：
//
//	   持有一只股票，记做f[i][0]
//	   不持有股票，并且处于冷冻期，记做f[i][1]
//		  不持有股票，不处于冷冻期，记做f[i][2]
//
// 状态转移:
//  1. f[i][0],说明这一只股票可以是在i-1天就已经持有的，对应状态为f[i-1][0];或者是第i天买入的，
//     那么第i-1天一定不能是冷冻期，也不能是持有，对应状态为f[i-1][2],对应的收益应该是f[i-1][2]-prices[i],
//     最终收益应该是max(f[i-1][2]-prices[i],f[i-1][0])
//  2. f[i][1],这一天处于冷冻期，说明i这一天卖出了,推出i-1这一天一定持有，对应的状态为f[i-1][0]，对应的收益为f[i-1][0]+price[i]
//  3. f[i][2],这一天不持有也不是冷冻期，说明在i-1也不持有，在i-1这一天如果是冷冻期，则对应的状态为f[i-1][1]，
//     如果i-1不是冷冻期则对应的状态为f[i-1][2]，因此此时对应的收益应当是max(f[i-1][1],f[i-1][2])
//
// 初始状态:
//
//	f[0][0] = -prices[0]
//	f[0][1] = 0
//	f[0][2] = 0
func maxProfit(prices []int) int {

	if len(prices) == 1 {
		return 0
	}

	var dp [][3]int = make([][3]int, len(prices))
	dp[0][0] = -prices[0]
	for i := 1; i < len(prices); i++ {
		//max(f[i-1][2]-prices[i],f[i-1][0])
		dp[i][0] = max(dp[i-1][2]-prices[i], dp[i-1][0])
		//f[i-1][0]+price[i]
		dp[i][1] = dp[i-1][0] + prices[i]
		//max(f[i-1][1],f[i-1][2])
		dp[i][2] = max(dp[i-1][1], dp[i-1][2])
	}
	return max(dp[len(dp)-1][1], dp[len(dp)-1][2])
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
