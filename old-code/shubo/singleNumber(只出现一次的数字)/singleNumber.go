package main

import "fmt"

func main() {
	fmt.Println(singleNumber([]int{2, 2, 1}))
	fmt.Println(singleNumber([]int{4, 1, 2, 1, 2}))
}

//异或运算：
//a^0 = a
//a^a = 0
func singleNumber(nums []int) int {
	ret := 0
	for _, num := range nums {
		ret ^= num
	}
	return ret
}
