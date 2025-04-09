package main

//func climbStairs(n int) int {
//	if n == 1 {
//		return 1
//	}
//	if n == 2 {
//		return 2
//	}
//	return climbStairs(n-1) + climbStairs(n-2)
//}

func climbStairs(n int) int {
	list := [2]int{1, 2}
	for i := 2; i < n; i++ {
		list[i%2] = list[0] + list[1]
	}
	return list[(n-1)%2]
}
