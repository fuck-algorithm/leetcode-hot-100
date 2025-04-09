package main

import (
	"sort"
	"testing"
)

//假设有打乱顺序的一群人站成一个队列，数组 people 表示队列中一些人的属性（不一定按顺序）。每个 people[i] = [hi, ki] 表示第 i 个人的身高为 hi ，前面 正好 有 ki 个身高大于或等于 hi 的人。
//
//请你重新构造并返回输入数组 people 所表示的队列。返回的队列应该格式化为数组 queue ，其中 queue[j] = [hj, kj] 是队列中第 j 个人的属性（queue[0] 是排在队列前面的人）。

// 先按照队列次序排序
// 再从前向后调整错误的队列次序
func reconstructQueue(people [][]int) [][]int {
	sort.Slice(people, func(i, j int) bool {
		return people[i][0] < people[j][0] || people[i][0] == people[j][0] && people[i][1] > people[j][1]
	})
	ret := make([][]int, len(people))
	for _, person := range people {
		spaces := person[1] + 1
		for i := range ret {
			if ret[i] != nil {
				continue
			}
			spaces--
			if spaces == 0 {
				ret[i] = person
			}
		}
	}
	return ret
}

func TestReconstructQueue(t *testing.T) {
	t.Log(reconstructQueue([][]int{{7, 0}, {4, 4}, {7, 1}, {5, 0}, {6, 1}, {5, 2}}))
}

// [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
