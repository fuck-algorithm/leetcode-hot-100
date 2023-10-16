# 283. 移动零

# 题目

```
https://leetcode.cn/problems/move-zeroes/
```

# 思路

妈的先过了再说：

```go
func moveZeroes(nums []int)  {
    for i:=0; i<len(nums); i++ {
        if nums[i] != 0 {
            continue
        }
        for j:=i+1; j<len(nums); j++ {
            if nums[j] != 0 {
                nums[i], nums[j] = nums[j], nums[i]
            }
        }
    }
}
```



















