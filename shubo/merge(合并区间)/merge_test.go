package main

import (
	"sort"
	"testing"
)

// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

// 排序
// 比较左右的区间起止点
// 合并/添加到结果
func merge(intervals [][]int) [][]int {
	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i][0] < intervals[j][0]
	})
	var ans = [][]int{intervals[0]}
	for i := 1; i < len(intervals); i++ {
		if intervals[i][0] <= ans[len(ans)-1][1] {
			ans[len(ans)-1][1] = max(intervals[i][1], ans[len(ans)-1][1])
		} else {
			ans = append(ans, intervals[i])
		}
	}
	return ans
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func TestMerge(t *testing.T) {
	t.Log(merge([][]int{{1, 3}, {2, 6}, {8, 10}, {15, 18}}))
}
