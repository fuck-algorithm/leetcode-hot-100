package main

import "fmt"

func canJump(nums []int) bool {
	// dp
	dp := make([]bool, len(nums))
	dp[len(nums)-1] = true

	for i := len(nums) - 1; i >= 0; i-- {
		for j := 0; j <= nums[i]; j++ {
			if i+j >= len(nums) {
				continue
			}
			dp[i] = dp[i] || dp[i+j]
		}
	}

	return dp[0]
}

func main() {
	fmt.Println(canJump([]int{0, 1}))
}
