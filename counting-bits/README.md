# 338. 比特位计数

题目：
```text
https://leetcode.cn/problems/counting-bits/description/?favorite=2cktkvj
```

代码：
```go
func countBits(n int) []int {
    answer := make([]int, n+1)
    for index:=0; index<=n; index++ {
        answer[index] = count(index)
    }
    return answer 
}

func count(n int) int {
    count := 0 
    for n > 0{
        count++ 
        n &= n-1
    }
    return count 
}

```
