package main

import "fmt"

func countBits(n int) []int {
	var ret []int
	for i := 0; i <= n; i++ {
		cur := i
		cnt := 0
		for cur > 0 {
			if cur&1 == 1 {
				cnt++
			}
			cur = cur >> 1
		}
		ret = append(ret, cnt)
	}
	return ret
}

func main() {
	fmt.Println(countBits(2))
	fmt.Println(countBits(5))
}
