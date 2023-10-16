# 34. 在排序数组中查找元素的第一个和最后一个位置

https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/

二分：
```go
func searchRange(nums []int, target int) []int {
    left := 0 
    right := len(nums) - 1 
    for left <= right {
        mid := (left + right) / 2 
        if nums[mid] == target {
            left = mid 
            right = mid 
            for left >= 0 && nums[left] == nums[mid] {
                left-- 
            }
            for right < len(nums) && nums[right] == nums[mid] {
                right++  
            }
            return []int{left+1, right-1}
        } else if nums[mid] > target {
            right = mid - 1
        } else {
            left = mid + 1 
        }
    }
    return []int{-1, -1}
}
```

