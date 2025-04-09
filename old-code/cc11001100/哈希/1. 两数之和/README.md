# 1. 两数之和

# 一、题目描述

题目链接：

```bash
https://leetcode.cn/problems/two-sum/description/
```



给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`* 的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

 

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

 

**提示：**

- `2 <= nums.length <= 104`
- `-109 <= nums[i] <= 109`
- `-109 <= target <= 109`
- **只会存在一个有效答案**

 

**进阶：**你可以想出一个时间复杂度小于 `O(n2)` 的算法吗？

# 二、思路

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
