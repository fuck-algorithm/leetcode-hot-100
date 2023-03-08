package main

import "fmt"

func hammingDistance(x int, y int) int {
	cnt := 0
	for x+y > 0 {
		if x&1 != y&1 {
			cnt++
		}
		x = x >> 1
		y = y >> 1
	}
	return cnt
}

func main() {
	fmt.Println(hammingDistance(1, 4))
	fmt.Println(hammingDistance(3, 1))
}
