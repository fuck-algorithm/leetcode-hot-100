# 461. 汉明距离

题目：
```text
https://leetcode.cn/problems/hamming-distance/description/?favorite=2cktkvj
```
代码：
```go
func hammingDistance(x int, y int) int {
    s := x ^ y 
    answer := 0 
    for s > 0 {
        answer++ 
        s &= s -1 
    }
    return answer 
}
```
