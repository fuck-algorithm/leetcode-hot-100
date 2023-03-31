package main

import "fmt"

// 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
//
// 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

func letterCombinations(digits string) (ans []string) {
	n := len(digits)
	if n == 0 {
		return
	}
	path := make([]byte, n)
	var dfs func(int)
	dfs = func(i int) {
		if i == n {
			ans = append(ans, string(path))
			return
		}
		for _, c := range transDigits(digits[i]) {
			path[i] = byte(c)
			dfs(i + 1)
		}
	}
	dfs(0)
	return
}

func transDigits(b byte) []byte {

	ret := []byte("abcdefghijklmnopqrstuvwxyz")
	idx := (b - '0' - 2) * 3

	switch b {
	case '2', '3', '4', '5', '6':
		return ret[idx : idx+3]
	case '7':
		return ret[idx : idx+4]
	case '8':
		return ret[idx+1 : idx+4]
	case '9':
		return ret[idx+1:]
	default:
		return nil
	}
}
func main() {
	fmt.Println(letterCombinations("23"))
	fmt.Println(letterCombinations("2"))
}
