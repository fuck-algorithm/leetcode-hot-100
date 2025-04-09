package main

func twoSum(nums []int, target int) []int {
	hash := make(map[int]int)
	// x + y = target
	// y = target - x

	for i, num := range nums {
		if j, ok := hash[target-num]; ok {
			return []int{j, i}
		} else {
			hash[num] = i
		}
	}
	return nil
}
