package main

func maxProfit(prices []int) int {
	res := 0
	m := prices[0]
	for i := 1; i < len(prices); i++ {
		m = min(m, prices[i])
		res = max(res, prices[i]-m)
	}
	return res
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
