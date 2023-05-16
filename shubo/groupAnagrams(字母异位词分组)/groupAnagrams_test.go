package main

import "testing"

//给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
//
//字母异位词 是由重新排列源单词的字母得到的一个新单词，所有源单词中的字母通常恰好只用一次。

// 思路1： hash记忆位置，排序字符串，比较字符串判断是否相等 记入结果字符串二维数组

// 思路2 评论区看的说是国外大佬思路： 给每一个字母指定一个质数作为标识。字符串中的字符相乘乘积（不过可能会溢出哦）相等则互为 字母异位词

// 思路3 map 以 [26]int为key []string为value 直接做计数
func TestPrime(t *testing.T) {
	t.Log(len(prime()))
}
func TestGroupAnagrams(t *testing.T) {
	//t.Log(groupAnagrams([]string{"eat", "tea", "tan", "ate", "nat", "bat"}))
	//t.Log(groupAnagrams([]string{"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"}))

}
func prime() []int {
	return []int{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101}
}

// 不知道为啥这个用例过不了 ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"]
func groupAnagrams(strs []string) [][]string {
	p := prime()
	if len(strs) <= 1 {
		return [][]string{strs}
	}
	var hash = map[int][]string{}
	for _, str := range strs {
		k := 1
		for _, c := range str {
			k *= p[c-'a']
		}
		hash[k] = append(hash[k], str)
	}
	var ans [][]string
	for _, v := range hash {
		ans = append(ans, v)
	}
	return ans
}

// 计数
func groupAnagrams1(strs []string) [][]string {
	mp := map[[26]int][]string{}
	for _, str := range strs {
		cnt := [26]int{}
		for _, b := range str {
			cnt[b-'a']++
		}
		mp[cnt] = append(mp[cnt], str)
	}
	ans := make([][]string, 0, len(mp))
	for _, v := range mp {
		ans = append(ans, v)
	}
	return ans
}
