package main

// 给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
//
// 异位词 指由相同字母重排列形成的字符串（包括相同的字符串）。
// 输入: s = "cbaebabacd", p = "abc"
// 输出: [0,6]
// 解释:
// 起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
// 起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
//
// 输入: s = "abab", p = "ab"
// 输出: [0,1,2]
// 解释:
// 起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
// 起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
// 起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。

// 固定窗口大小
// 判断窗口是否异位词

func findAnagrams(s string, p string) []int {
	var ans []int
	if len(s) < len(p) {
		return []int{}
	}
	var sMP, pMp [26]int
	for _, c := range p {
		pMp[c-'a']++
	}
	for i := 0; i < len(s); i++ {
		sMP[s[i]-'a']++
		if i >= len(p)-1 {
			if sMP == pMp {
				ans = append(ans, i-len(p)+1)
			}
			sMP[s[i-len(p)+1]-'a']--
		}
	}
	return ans
}
