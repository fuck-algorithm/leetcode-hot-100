package main

import "fmt"

func findDisappearedNumbers(nums []int) []int {
	for _, num := range nums {
		nums[abs(num)-1] = -abs(nums[abs(num)-1])
	}
	res := []int{}
	for idx, num := range nums {
		if num > 0 {
			res = append(res, idx+1)
		}
	}
	return res
}

func abs(a int) int {
	if a > 0 {
		return a
	}
	return -a
}

func main() {
	fmt.Println(findDisappearedNumbers([]int{4, 3, 2, 7, 8, 2, 3, 1}))
}
