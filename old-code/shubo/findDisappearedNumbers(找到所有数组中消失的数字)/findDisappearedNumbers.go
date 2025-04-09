package main

import "fmt"

// 妙啊妙啊妙啊[1,n] ，重生之数组也能当哈希
func findDisappearedNumbers(nums []int) []int {
	n := len(nums)
	var ret []int
	for _, num := range nums {
		num = (num - 1) % n
		nums[num] += n
	}
	for i, num := range nums {
		if num <= n {
			ret = append(ret, i+1)
		}
	}
	return ret
}
func main() {
	fmt.Println(findDisappearedNumbers([]int{4, 3, 2, 7, 8, 2, 3, 1}))
	fmt.Println(findDisappearedNumbers([]int{1, 1}))
}
