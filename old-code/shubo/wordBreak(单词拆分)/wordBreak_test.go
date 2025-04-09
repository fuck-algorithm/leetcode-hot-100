package main

//给你一个字符串 s 和一个字符串列表 wordDict 作为字典。请你判断是否可以利用字典中出现的单词拼接出 s 。
//
//注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
//示例 1：
//
//输入: s = "leetcode", wordDict = ["leet", "code"]
//输出: true
//解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。

// 看了题解，可以dp，也可以dfs+剪枝，也可以bfs加剪枝

// dp解法
// 减小问题规模，分解子问题：
//  1. 前i个字符能否分解成单词
//  2. i+1～n 之间的字符是否为某个单词
//
// 设dp[i] []bool{}：长度为i的子串s[0,i-1]是否能拆分成单词，最后返回dp[n]
// 初始状态令dp[0]=0
func wordBreak(s string, wordDict []string) bool {
	wordMap := map[string]bool{}
	for _, word := range wordDict {
		wordMap[word] = true
	}
	dp := make([]bool, len(s)+1)
	dp[0] = true
	for i := 1; i <= len(s); i++ {
		for j := i - 1; j >= 0; j-- {
			if dp[i] == true {
				break
			}
			if dp[j] == false {
				continue
			}
			suffix := s[j:i]
			if wordMap[suffix] && dp[j] {
				dp[i] = true
				break
			}
		}
	}
	return dp[len(s)]
}

// TODO dfs+剪枝 ，bfs+剪枝
