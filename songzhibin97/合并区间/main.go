package main

import "sort"

func merge(intervals [][]int) [][]int {
	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i][0] < intervals[j][0] || intervals[i][0] == intervals[j][0] && intervals[i][1] < intervals[j][1]
	})

	res := [][]int{}
	v := intervals[0]
	for i := 1; i < len(intervals); i++ {
		if v[1] >= intervals[i][0] {
			v[1] = max(v[1], intervals[i][1])
		} else {
			res = append(res, v)
			v = intervals[i]
		}
	}
	res = append(res, v)
	return res
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func main() {

}
