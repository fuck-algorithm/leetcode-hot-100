package main

import (
	"testing"
)

//你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
//在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。
//例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
//请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。

// 看了题解：
// bfs:
//  1. 创建 k为节点id，v为入度节点的列表 (当v的长度为0时，我们可以认为是没有先修课的，可以直接学习)
//  2. 维护一个队列，当有入度为0的节点时，入队。
//  3. 弹出队列元素，并搜索元素对应的出度节点，同时更新对应的出度节点的v值。
//  4. 当队列元素为空，而还有未学习课程时，说明存在环。直接返回false。
//func canFinishBfs(numCourses int, prerequisites [][]int) bool {
//	// 入度表
//	var mp = map[int][]int{}
//	// 出度表
//	var mp1 = map[int][]int{}
//	for _, prerequisite := range prerequisites {
//		mp[prerequisite[0]] = append(mp[prerequisite[0]], prerequisite[1])
//		mp[prerequisite[1]] = []int{}
//		mp1[prerequisite[1]] = append(mp1[prerequisite[1]], prerequisite[0])
//		mp1[prerequisite[0]] = []int{}
//
//	}
//	var q []int
//	var hash = map[int]bool{}
//	var res []int
//	for len(res) < numCourses {
//		var flag bool
//		// 入度表为空的节点，入队
//		for k, v := range mp {
//			if len(v) == 0 {
//				if hash[k] {
//					continue
//				}
//				q = append(q, k)
//				hash[k] = true
//				flag = true
//			}
//		}
//		// 如果没有可以入队的
//		if !flag && len(q) == 0 {
//			break
//		}
//		// 出队
//		end := q[0]
//		q = q[1:]
//		// 遍历出度表
//		for _, v := range mp1[end] {
//			// 在mp的v中移除某一个元素
//			t := 0
//			if len(mp[v]) == 0 {
//				continue
//			}
//			for i, vv := range mp[v] {
//				if vv == end {
//					t = i
//					break
//				}
//			}
//			mp[v] = append(mp[v][:t], mp[v][t+1:]...)
//		}
//		res = append(res, end)
//	}
//	return len(res) == len(mp)
//}
//
//func canFinish1(numCourses int, prerequisites [][]int) bool {
//	var (
//		edges   = make([][]int, numCourses)
//		visited = make([]int, numCourses)
//		result  []int
//		valid   = true
//		dfs     func(u int)
//	)
//
//	dfs = func(u int) {
//		visited[u] = 1
//		for _, v := range edges[u] {
//			if visited[v] == 0 {
//				dfs(v)
//				if !valid {
//					return
//				}
//			} else if visited[v] == 1 {
//				valid = false
//				return
//			}
//		}
//		visited[u] = 2
//		result = append(result, u)
//	}
//
//	for _, info := range prerequisites {
//		edges[info[1]] = append(edges[info[1]], info[0])
//	}
//
//	for i := 0; i < numCourses && valid; i++ {
//		if visited[i] == 0 {
//			dfs(i)
//		}
//	}
//	return valid
//}

//func TestCanFinishedBfs(t *testing.T) {
//	t.Log(canFinishBfs(2, [][]int{{1, 0}}))
//	t.Log(canFinishBfs(2, [][]int{{1, 0}, {0, 1}}))
//	t.Log(canFinishBfs(1, [][]int{}))
//	t.Log(canFinishBfs(5, [][]int{{1, 4}, {2, 4}, {3, 1}, {3, 2}}))
//}

func TestRemoveItemFromSlice(t *testing.T) {
	a := []int{1, 2, 3}
	end := 1
	//移除某一个元素
	tt := 0
	for i, vv := range a {
		if vv == end {
			tt = i
			break
		}
	}
	a = append(a[:tt], a[tt+1:]...)

	t.Log(a)
}

// dfs:
//  1. 为每个节点增加状态：未搜索、搜索中、已搜索
//  2. 创建k为节点id，v为出度节点的列表
//  3. 碰到搜索中的节点，则认为有环存在。
//  4. 维护一个栈，已搜索完成的节点可以入栈。

//	func canFinish(numCourses int, prerequisites [][]int) bool {
//		var coursesMap = map[int]struct{}{}
//		for _, prerequisite := range prerequisites {
//			coursesMap[prerequisite[0]] = struct{}{}
//			coursesMap[prerequisite[1]] = struct{}{}
//		}
//		if numCourses < len(coursesMap) {
//			return false
//		}
//		hash := map[int]int{}
//		for _, prerequisite := range prerequisites {
//			hash[prerequisite[0]] = prerequisite[1]
//		}
//		picked := map[int]bool{}
//		var rr func(classId int) bool
//		rr = func(classId int) bool {
//			if numCourses < 0 {
//				return false
//			}
//			if !picked[classId] {
//				numCourses--
//			}
//			picked[classId] = true
//			if c, ok := hash[classId]; !ok {
//				return true
//			} else {
//				return rr(c)
//			}
//		}
//		for _, prerequisite := range prerequisites {
//			if picked[prerequisite[0]] {
//				continue
//			}
//			if !rr(prerequisite[0]) {
//				return false
//			}
//		}
//		return true
//	}
//
// cv 的
func canFinish(numCourses int, prerequisites [][]int) bool {
	var (
		edges   = make([][]int, numCourses)
		visited = make([]int, numCourses)
		result  []int
		valid   = true
		dfs     func(u int)
	)

	dfs = func(u int) {
		visited[u] = 1
		for _, v := range edges[u] {
			if visited[v] == 0 {
				dfs(v)
				if !valid {
					return
				}
			} else if visited[v] == 1 {
				valid = false
				return
			}
		}
		visited[u] = 2
		result = append(result, u)
	}

	for _, info := range prerequisites {
		edges[info[1]] = append(edges[info[1]], info[0])
	}

	for i := 0; i < numCourses && valid; i++ {
		if visited[i] == 0 {
			dfs(i)
		}
	}
	return valid
}
func TestCanFinished(t *testing.T) {
	t.Log(canFinish(2, [][]int{{1, 0}}))
	t.Log(canFinish(2, [][]int{{1, 0}, {0, 1}}))
	t.Log(canFinish(1, [][]int{}))
	t.Log(canFinish(5, [][]int{{1, 4}, {2, 4}, {3, 1}, {3, 2}}))
}
