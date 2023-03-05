package main

func moveZeroes(nums []int) {
	curr := 0
	for _, num := range nums {
		if num != 0 {
			nums[curr] = num
			curr++
		}
	}
	for curr < len(nums) {
		nums[curr] = 0
		curr++
	}

}
func main() {
	moveZeroes([]int{0, 1, 0, 3, 12})
}
