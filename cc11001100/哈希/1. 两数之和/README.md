# 1. 两数之和

## 题目链接

```bash
https://leetcode.cn/problems/two-sum/description/?favorite=2cktkvj
```

## 方法一：暴力搜索

两次`for`循环暴力搜索，时间复杂度为`O(n^2)`：

```go
func twoSum(nums []int, target int) []int {
    for i:=0;i<len(nums); i++ {
        for j:=i+1; j<len(nums); j++ {
            if nums[i] + nums[j] == target {
                return []int{i, j}
            }
        }
    }
    return nil 
}
```

## 方法二：哈希表

先遍历一次做一张哈希表，然后再遍历一次从哈希表来匹配，时间复杂度为`O(2n)`，空间复杂度为`O(n)`，这里有一个需要注意的细节是因为同一个下标的元素不能重复使用，所以当匹配的时候需要排除掉下标相同的情况：

```go
func twoSum(nums []int, target int) []int {
    m := make(map[int]int, 0)
    for i, v := range nums {
        m[v] = i 
    }
    for i, v := range nums {
        targetIndex, exists := m[target-v]
        if exists && i != targetIndex {
            return []int{i, targetIndex}
        }
    }
    return nil 
}
```
