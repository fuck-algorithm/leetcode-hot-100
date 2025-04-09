package main

import (
	"fmt"
	"testing"
)

func TestCountSubstrings(t *testing.T) {
	fmt.Println(countSubstrings("aaa"))
	fmt.Println(countSubstrings("abc"))
}

//给你一个字符串 s ，请你统计并返回这个字符串中 回文子串 的数目。
//回文字符串 是正着读和倒过来读一样的字符串。
//子字符串 是字符串中的由连续字符组成的一个序列。
//具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。

func isPalindrome(s string) bool {
	if len(s) == 0 {
		return false
	}
	i := 0
	j := len(s) - 1
	for i < j {
		if s[i] != s[j] {
			return false
		}
		i++
		j--
	}
	return true
}

// 暴力 击败了百分之5：枚举每一个子串，判断是否回文
func countSubstrings(s string) int {
	subStrs := enumSubString(s)
	count := 0
	for _, str := range subStrs {
		if isPalindrome(str) {
			count++
		}
	}
	return count
}
func enumSubString(s string) (ret []string) {
	for i := 0; i < len(s); i++ {
		for j := i + 1; j <= len(s); j++ {
			ret = append(ret, s[i:j])
		}
	}
	return
}
