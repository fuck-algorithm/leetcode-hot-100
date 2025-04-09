package main

import "fmt"

func exist(board [][]byte, word string) bool {
	nx, ny := []int{0, 1, 0, -1}, []int{1, 0, -1, 0}
	path := make(map[[2]int]bool)

	var dfs func(i, j int, target []byte) bool
	dfs = func(i, j int, target []byte) bool {

		if len(target) == 0 {
			return true
		}

		if i < 0 || i >= len(board) || j < 0 || j >= len(board[0]) {
			return false
		}
		if path[[2]int{i, j}] {
			return false
		}

		path[[2]int{i, j}] = true
		defer func() {
			path[[2]int{i, j}] = false
		}()

		if board[i][j] != target[0] {
			return false
		}

		for v := 0; v < 4; v++ {
			x, y := nx[v]+i, ny[v]+j
			if dfs(x, y, target[1:]) {
				return true
			}
		}
		return false
	}

	for i := 0; i < len(board); i++ {
		for j := 0; j < len(board[0]); j++ {
			if board[i][j] == word[0] && dfs(i, j, []byte(word)) {
				return true
			}
		}
	}
	return false
}

func main() {
	fmt.Println(exist([][]byte{{'A', 'B', 'C', 'E'}, {'S', 'F', 'C', 'S'}, {'A', 'D', 'E', 'E'}}, "ABCB"))
}
