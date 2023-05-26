package main

import (
	"testing"
)

// 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。
// 如果 word 存在于网格中，返回 true ；否则，返回 false 。
//
// 单词必须按照字母顺序，通过相邻的单元格内的字母构成，
// 其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

func TestExist(t *testing.T) {
	//输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
	//输出：true
	//t.Log(exist([][]byte{{'A', 'B', 'C', 'E'}, {'S', 'F', 'C', 'S'}, {'A', 'D', 'E', 'E'}},
	//	"ABCCED"))
	//t.Log(exist([][]byte{{'A', 'B', 'C', 'E'}, {'S', 'F', 'C', 'S'}, {'A', 'D', 'E', 'E'}},
	//	"SEE"))
	//t.Log(exist([][]byte{{'A', 'B', 'C', 'E'}, {'S', 'F', 'C', 'S'}, {'A', 'D', 'E', 'E'}},
	//	"ABCB"))
	t.Log(exist([][]byte{
		{'a', 'a', 'b', 'a', 'a', 'b'},
		{'a', 'a', 'b', 'b', 'b', 'a'},
		{'a', 'a', 'a', 'a', 'b', 'a'},
		{'b', 'a', 'b', 'b', 'a', 'b'},
		{'a', 'b', 'b', 'a', 'b', 'a'},
		{'b', 'a', 'a', 'a', 'a', 'b'}},
		"bbbaabbbbbab"))
}

// 先找起点
// 尝试匹配后边的字符
func exist(board [][]byte, word string) bool {
	m := len(board)
	n := len(board[0])
	if m*n < len(word) {
		return false
	}
	//i, j := 0, 0
	for i := 0; i < m; i++ {
		for j := 0; j < n; j++ {
			//fmt.Println("i:", i, "j:", j, "board[i][j]:", string(board[i][j]), " word[0]:", string(word[0]))
			if board[i][j] == word[0] {
				if match(board, i, j, 1, word) {
					return true
				} else {
					continue
				}
			}
		}
	}
	return false

}

// 用过一次的就置为空格
// dfs + 回溯
func match(board [][]byte, i, j, idx int, word string) bool {
	t := board[i][j]
	board[i][j] = byte(' ')
	if len(word) <= 1 {
		return true
	}
	if idx >= len(word) {
		return true
	}
	ans := false
	for {
		if i-1 >= 0 && board[i-1][j] == word[idx] {
			ans = ans || match(board, i-1, j, idx+1, word)
		}
		if i+1 < len(board) && board[i+1][j] == word[idx] {
			ans = ans || match(board, i+1, j, idx+1, word)
		}
		if j-1 >= 0 && board[i][j-1] == word[idx] {
			ans = ans || match(board, i, j-1, idx+1, word)
		}
		if j+1 < len(board[0]) && board[i][j+1] == word[idx] {
			ans = ans || match(board, i, j+1, idx+1, word)
		}
		if !ans {
			board[i][j] = t
		}
		return ans
	}
}
