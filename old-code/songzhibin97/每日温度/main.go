package main

func dailyTemperatures(temperatures []int) []int {
	res := make([]int, len(temperatures))
	queue := []int{}
	for idx, temperature := range temperatures {
		for len(queue) != 0 && temperatures[queue[len(queue)-1]] < temperature {
			v := queue[len(queue)-1]
			queue = queue[:len(queue)-1]
			res[v] = idx - v
		}
		queue = append(queue, idx)
	}
	return res
}
