# 70. 爬楼梯

题目：
```bash
https://leetcode.cn/problems/climbing-stairs/description/?favorite=2cktkvj
```
代码：
```go
func climbStairs(n int) int {
    if n <= 2 {
        return n 
    }
    a := 1
    b := 2 
    for index := 3; index<=n; index++ {
        c := a + b 
        a = b 
        b = c 
    }
    return b 
}
```
