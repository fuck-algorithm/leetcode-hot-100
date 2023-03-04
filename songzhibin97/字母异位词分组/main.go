package main

func groupAnagrams(strs []string) [][]string {
	hash := make(map[[26]int][]string)
	for _, str := range strs {
		key := [26]int{}
		for _, v := range str {
			key[v-'a']++
		}
		hash[key] = append(hash[key], str)
	}

	res := make([][]string, 0, len(hash))
	for _, strings := range hash {
		res = append(res, strings)
	}
	return res
}
