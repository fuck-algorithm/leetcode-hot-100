package main

func lengthOfLongestSubstring(s string) int {
	left := 0
	res := 0
	mp := make(map[byte]int)
	for right := 0; right < len(s); right++ {
		mp[s[right]]++
		if mp[s[right]] > 1 {
			for left < right && mp[s[right]] > 1 {
				mp[s[left]]--
				left++
			}
		}
		res = max(res, right-left+1)
	}
	return res
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
