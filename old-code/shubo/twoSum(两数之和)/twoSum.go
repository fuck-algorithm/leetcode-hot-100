package main

import (
	"fmt"
)

func twoSum(nums []int, target int) []int {
	hash := map[int]int{}
	for i, num := range nums {
		if x, ok := hash[target-num]; ok {
			return []int{i, x}
		}
		hash[num] = i
	}
	return nil
}
func main() {
	fmt.Print(twoSum([]int{3, 2, 4}, 6))
	fmt.Print(twoSum([]int{3, 3}, 6))
}
