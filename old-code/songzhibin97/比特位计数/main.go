package main

import "math/bits"

func countBits(n int) []int {
	res := make([]int, n+1)
	for i := 0; i <= n; i++ {
		res[i] = bits.OnesCount(uint(i))
	}
	return res
}
