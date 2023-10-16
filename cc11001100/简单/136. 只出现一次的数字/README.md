# 136. 只出现一次的数字
# 题目

```text
https://leetcode.cn/problems/single-number/description/?favorite=2cktkvj
```
# 代码

```go
func singleNumber(nums []int) int {
    answer := 0 
    for _, value := range nums {
        answer ^= value
    }
    return answer 
}
```