# 448. 找到所有数组中消失的数字

题目：
```text
https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array/description/?favorite=2cktkvj
```
代码：
```go
func findDisappearedNumbers(nums []int) []int {
    // 标记 
    for _, value := range nums {
        valueIndex := abs(value)-1
        nums[valueIndex] = negative(nums[valueIndex])
    }
    // 收集
    ans := make([]int, 0)
    for index, value := range nums {
        if value > 0 {
            ans = append(ans, index+1)
        }
    }
    return ans 
}

func abs(n int) int {
    if n < 0 {
        return -n 
    } else {
        return n 
    }
}

func negative(n int) int {
    if n < 0 {
        return n 
    } else {
        return -n 
    }
}

```
