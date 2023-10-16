# 121. 买卖股票的最佳时机

# 题目
```text
https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description/
```

# 思路

妈的暴力过不了

```go
func maxProfit(prices []int) int {
    // 最朴素的想法，暴力 
    max := 0 
    for i:=0; i<len(prices); i++ {
        for j:=i+1; j<len(prices); j++ {
            p := prices[j] - prices[i]
            if p > max {
                max = p 
            }
        }
    }
    return max 
}
```

每个数字都减去自己前面的最小的一个数，取得到的值中最大的那个就是能够赚取的利润 

```go
func maxProfit(prices []int) int {
    max := 0 
    currentMin := -1 
    for _, n := range prices {
        if currentMin == -1 {
            currentMin = n 
        } else {
            if n - currentMin > max {
                max = n - currentMin 
            }
            if n < currentMin {
                currentMin = n 
            }
        }
    }
    return max 
}
```









