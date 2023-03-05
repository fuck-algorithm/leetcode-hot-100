package main

import "fmt"

func main() {
	fmt.Println(climbStairs(2))
	fmt.Println(climbStairs(3))
	fmt.Println(climbStairs(4))
}
func climbStairs(n int) int {
	a, b, sum := 0, 0, 1
	if n <= 1 {
		return n
	}
	for i := 0; i < n; i++ {
		a = b
		b = sum
		sum = a + b
	}
	return sum
}
