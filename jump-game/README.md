# 55. 跳跃游戏

题目：
```text
https://leetcode.cn/problems/jump-game/description/
```
代码：
```go
func canJump(nums []int) bool {
    if len(nums) <= 1 {
        return true 
    }
    // 从后往前跳 
    for index:=len(nums)-1; index>=0; index--{
        if nums[index] != 0 {
            continue 
        }
        // 向前寻找一个能够跳到当前位置的下标 
        // 如果是最后一个下标，需要跳到，否则需要跳过 
        needStep := 2
        if index == len(nums) - 1 {
            needStep = 1 
        }
        findSuccess := false 
        index-- 
        for index >= 0 {
            // 寻找到了 
            if nums[index] >= needStep {
                findSuccess = true 
                break 
            }
            index-- 
            needStep++ 
        }
        if !findSuccess {
            return false 
        }
    }
    return true 
}
```
