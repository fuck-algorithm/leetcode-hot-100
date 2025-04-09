package main

import "fmt"

//给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

func lengthOfLongestSubstring(s string) int {
	if len(s) <= 1 {
		return len(s)
	}
	//key为字符
	//v为字符对应的索引
	var hash = map[byte]int{}
	left := 0
	var ret int
	for i := 0; i < len(s); i++ {
		if lastIdx, ok := hash[s[i]]; ok {
			left = max(left, lastIdx+1)
		}
		hash[s[i]] = i
		ret = max(i-left+1, ret)

	}
	return ret
}
func main() {
	//fmt.Println(lengthOfLongestSubstring("abcabcbb"))
	//fmt.Println(lengthOfLongestSubstring("bbbbb"))
	//fmt.Println(lengthOfLongestSubstring("pwwkew"))
	//fmt.Println(lengthOfLongestSubstring(" "))
	fmt.Println(lengthOfLongestSubstring("au"))
	fmt.Println(lengthOfLongestSubstring("aub"))
	fmt.Println(lengthOfLongestSubstring("abba"))
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
