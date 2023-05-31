package main

import (
	"testing"
)

//你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
//在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。
//例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
//请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。

func canFinish(numCourses int, prerequisites [][]int) bool {
	var coursesMap = map[int]struct{}{}
	for _, prerequisite := range prerequisites {
		coursesMap[prerequisite[0]] = struct{}{}
		coursesMap[prerequisite[1]] = struct{}{}
	}
	if numCourses < len(coursesMap) {
		return false
	}
	hash := map[int]int{}
	for _, prerequisite := range prerequisites {
		hash[prerequisite[0]] = prerequisite[1]
	}
	picked := map[int]bool{}
	var rr func(classId int) bool
	rr = func(classId int) bool {
		if numCourses < 0 {
			return false
		}
		if !picked[classId] {
			numCourses--
		}
		picked[classId] = true
		if c, ok := hash[classId]; !ok {
			return true
		} else {
			return rr(c)
		}
	}
	for _, prerequisite := range prerequisites {
		if picked[prerequisite[0]] {
			continue
		}
		if !rr(prerequisite[0]) {
			return false
		}
	}
	return true
}
func TestCanFinished(t *testing.T) {
	t.Log(canFinish(2, [][]int{{1, 0}}))
	t.Log(canFinish(2, [][]int{{1, 0}, {0, 1}}))
	t.Log(canFinish(1, [][]int{}))
	t.Log(canFinish(5, [][]int{{1, 4}, {2, 4}, {3, 1}, {3, 2}}))
}
