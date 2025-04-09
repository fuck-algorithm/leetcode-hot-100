package main

import "fmt"

func canFinish(numCourses int, prerequisites [][]int) bool {
	// 建立出边数组
	graph := make([][]int, numCourses)
	count := make([]int, numCourses)
	for _, prerequisite := range prerequisites {
		graph[prerequisite[0]] = append(graph[prerequisite[0]], prerequisite[1])
		count[prerequisite[1]]++
	}
	res := 0
	queue := []int{}
	for i, v := range count {
		if v == 0 {
			queue = append(queue, i)
			res++
		}
	}
	for len(queue) != 0 {
		q := queue[0]
		queue = queue[1:]
		for _, v := range graph[q] {
			count[v]--
			if count[v] == 0 {
				queue = append(queue, v)
				res++
			}
		}
	}
	return res == numCourses
}

func main() {
	fmt.Println(canFinish(5, [][]int{{1, 4}, {2, 4}, {3, 1}, {3, 2}}))
}
