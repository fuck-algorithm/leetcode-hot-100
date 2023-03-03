package main

var mp = map[byte]string{
	'2': "abc",
	'3': "def",
	'4': "ghi",
	'5': "jkl",
	'6': "mno",
	'7': "pqrs",
	'8': "tuv",
	'9': "wxyz",
}

func letterCombinations(digits string) []string {
	res := make([]string, 0)
	path := []byte{}
	var dfs func(int)
	dfs = func(i int) {
		if i == len(digits) {
			if len(path) != 0 {
				res = append(res, string(path))
			}
			return
		}
		for _, v := range mp[digits[i]] {
			path = append(path, byte(v))
			dfs(i + 1)
			path = path[:len(path)-1]
		}
	}
	dfs(0)
	return res
}
