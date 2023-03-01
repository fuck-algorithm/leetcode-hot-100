package main

func majorityElement(nums []int) int {
	mp := make(map[int]int)
	for _, num := range nums {
		mp[num]++
		if mp[num] > len(nums)/2 {
			return num
		}
	}
	return -1
}
