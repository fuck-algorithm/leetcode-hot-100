package main

import "testing"

func TestCase1(t *testing.T) {
	//t.Log(longestValidParentheses("(()"))
	//t.Log(longestValidParentheses(")()())"))
	//t.Log(longestValidParentheses("()()"))
	//t.Log(longestValidParentheses(""))
	//t.Log(longestValidParentheses(")()("))
	//t.Log(longestValidParentheses("))(("))
	t.Log(longestValidParentheses("()(())"))
}

//给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。
//示例 1：
//
//输入：s = "(()"
//输出：2
//解释：最长有效括号子串是 "()"
//示例 2：
//
//输入：s = ")()())"
//输出：4
//解释：最长有效括号子串是 "()()"
//示例 3：
//
//输入：s = ""
//输出：0

// 使用栈来保证括号有效。记录最长连续的长度
func longestValidParentheses(s string) int {
	if len(s) <= 1 {
		return 0
	}
	stack := []byte{}
	ans := 0
	left := 0
	right := 0
	for i := 0; i < len(s); i++ {
		if s[i] == '(' {
			stack = append(stack, s[i])
			left = i
			continue
		}
		if len(stack) == 0 && s[i] == ')' {
			left++
			right++
		}
		if len(stack) != 0 {
			stack = stack[:len(stack)-1]
			if left-1 == right {
				ans = max(ans, ans+i-left+1)
			} else {
				ans = max(ans, i-left+1)

			}
			right = i
		}
	}
	return ans
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
