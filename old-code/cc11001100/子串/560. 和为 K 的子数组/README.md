# 560. 和为 K 的子数组

## 题目

```
https://leetcode.cn/problems/subarray-sum-equals-k/description/?favorite=2cktkvj
```

给你一个整数数组 `nums` 和一个整数 `k` ，请你统计并返回 *该数组中和为 `k` 的连续子数组的个数* 。

**示例 1：**

```
输入：nums = [1,1,1], k = 2
输出：2
```

**示例 2：**

```
输入：nums = [1,2,3], k = 3
输出：2
```

 **提示：**

- `1 <= nums.length <= 2 * 104`
- `-1000 <= nums[i] <= 1000`
- `-10^7 <= k <= 10^7`

## 方法不行： 滑动窗口

妈的滑动窗口有一部分测试用例过不了...

```go
func subarraySum(nums []int, k int) int {
    if len(nums) == 0 {
        return 0 
    }
    count := 0 
    windowSum := 0
    for i:=0; i<len(nums); i++ {
        windowSum += nums[i]
        count += find(nums, windowSum, k, 0, i)
    }
    return count 
}

func find(nums []int, windowSum, target, leftIndex, rightIndex int) int {
    count := 0 
    for {
        // 计算窗口值 
        if windowSum == target {
            count++ 
        }
        // 滑动窗口的值 
        windowSum -= nums[leftIndex]
        leftIndex++ 
        if leftIndex >= len(nums) {
            break 
        }
        rightIndex++
        if rightIndex >= len(nums) {
            break 
        }
        windowSum += nums[rightIndex]
    }
    return count 
}
```

## 方法一：暴力枚举

一路怼过去就完了

```go
func subarraySum(nums []int, k int) int {
    count := 0 
    for i:=0; i<len(nums); i++ {
        sum := 0 
        for j:=i; j<len(nums); j++ {
            sum += nums[j]
            if sum == k {
                count++ 
            }
        }
    }
    return count 
}
```

## 方法二： 前缀和

他妈的前缀和：

```go
func subarraySum(nums []int, k int) int {
    count := 0 
    prefixSum := 0 
    prefixSumCountMap := make(map[int]int, 0)
    prefixSumCountMap[0] = 1 
    for i:=0; i<len(nums); i++ {
        prefixSum += nums[i]
        count += prefixSumCountMap[prefixSum - k]
        prefixSumCountMap[prefixSum] = prefixSumCountMap[prefixSum] + 1 
    }
    return count 
}
```





