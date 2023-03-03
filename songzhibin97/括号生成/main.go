package main

import "fmt"

func generateParenthesis(n int) []string {
	path := make([]byte, 0)
	res := make([]string, 0)
	var dfs func(left, right int)
	dfs = func(left, right int) {
		if left+right == n*2 {
			if left == n {
				res = append(res, string(path))
			}
			return
		}
		if right < left {
			path = append(path, ')')
			dfs(left, right+1)
			path = path[:len(path)-1]
		}
		if left < n {
			path = append(path, '(')
			dfs(left+1, right)
			path = path[:len(path)-1]
		}
	}
	dfs(0, 0)
	return res
}

func main() {
	fmt.Println(generateParenthesis(3))
}
