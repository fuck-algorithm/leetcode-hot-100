# 1. 两数之和

题目链接：

```bash
https://leetcode.cn/problems/two-sum/description/?favorite=2cktkvj
```

AC代码： 

```go
func twoSum(nums []int, target int) []int {
    // 方法一：暴搜 
    // for indexA, valueA := range nums {
    //     for indexB := indexA+1; indexB < len(nums); indexB++ {
    //         valueB := nums[indexB]
    //         if valueA + valueB == target {
    //             return []int{indexA, indexB}
    //         }
    //     }
    // }
    // return []int{}
    
    // 方法二：遍历两次，第一次做一张哈希表，第二遍O(1)匹配 
    numIndexMap := make(map[int]int, 0)
    for index, value := range nums {
        numIndexMap[value] = index  
    }
    for index, value := range nums {
        need := target - value 
        if needIndex, exists := numIndexMap[need]; exists && needIndex != index {
            return []int{needIndex, index}
        }
    }
    return []int{} 
}
```
