package main

import "fmt"

//func sortColors(nums []int) {
//	v := [3]int{}
//	for _, num := range nums {
//		v[num]++
//	}
//	idx := 0
//	for i := range nums {
//		for v[idx] == 0 {
//			idx++
//		}
//		nums[i] = idx
//		v[idx]--
//	}
//}

func sortColors(nums []int) {
	start, end := 0, len(nums)-1
	for i := 0; i <= end; i++ {
		if nums[i] == 0 {
			nums[start], nums[i] = nums[i], nums[start]
			start++
		} else if nums[i] == 2 {
			nums[end], nums[i] = nums[i], nums[end]
			end--
			i--
		}
	}
	fmt.Println(nums)
}

func main() {
	sortColors([]int{2, 0, 2, 1, 1, 0})
}
