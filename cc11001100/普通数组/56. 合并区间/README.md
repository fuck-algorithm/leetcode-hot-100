# 56. 合并区间



# 题目

```
https://leetcode.cn/problems/merge-intervals/description/?favorite=2cktkvj
```

# 代码

```go
func merge(intervals [][]int) [][]int {
    // 如果只有一个范围的话则不必费劲了，直接返回即可 
    if len(intervals) <= 1 {
        return intervals 
    }
    // 然后对范围按照起始位置排序 
    sort.SliceStable(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    slice := make([][]int, 0)
    mergeBegin := intervals[0][0]
    mergeEnd := intervals[0][1]
    for _, item := range intervals {
        // 看下当前的范围是否可以合并进去 
        if mergeEnd >= item[0] {
            // 当前阶段可以合并进去，则将其合并，并更新合并后的范围，合并后的范围是取较大的一个 
            if item[1] > mergeEnd {
                mergeEnd = item[1]
            }
        } else {
            // 前一个阶段合并结束，将其记录下来 
            slice = append(slice, []int{mergeBegin, mergeEnd})
            mergeBegin = item[0]
            mergeEnd = item[1]
        }
    }
    slice = append(slice, []int{mergeBegin, mergeEnd})
    return slice 
}
```







