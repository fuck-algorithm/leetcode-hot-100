package main

func wordBreak(s string, wordDict []string) bool {
	dp := make([]bool, len(s)+1)
	dp[0] = true
	for i := range s {
		if !dp[i] {
			continue
		}

		for _, ns := range wordDict {
			if i+len(ns) <= len(s) && s[i:i+len(ns)] == ns {
				dp[i+len(ns)] = true
			}
		}
	}
	return dp[len(s)]
}
