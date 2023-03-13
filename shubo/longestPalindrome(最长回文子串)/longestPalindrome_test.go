package main

import (
	"fmt"
	"testing"
)

// 给你一个字符串 s，找到 s 中最长的回文子串。
//
// 如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。
//
// 示例 1：
//
// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。
// 示例 2：
//
// 输入：s = "cbbd"
// 输出："bb"

// 暴力一把梭
func longestPalindrome(s string) string {
	var ret = s[:1]
	right := len(s)
	left := 0
	for left < right {
		for ; left < right; left++ {
			if isPalindrome(s[left:right]) && (right-left) > len(ret) {
				ret = s[left:right]
			}
		}
		right--
		left = 0
	}
	return ret
}
func isPalindrome(s string) bool {
	left := 0
	right := len(s) - 1
	for left < right {
		if s[left] != s[right] {
			return false
		}
		left++
		right--
	}
	return true
}

func TestLongestIsPalindrome(t *testing.T) {
	fmt.Println(longestPalindrome("babad"))
	fmt.Println(longestPalindrome("cbbd"))
	fmt.Println(longestPalindrome("bb"))
	fmt.Println(longestPalindrome("b"))
	fmt.Println(longestPalindrome("ac"))
}
