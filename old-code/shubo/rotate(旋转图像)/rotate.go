package main

import "fmt"

func main() {
	m := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
	rotate(m)
	fmt.Println(m)
}

// 1. 转置 交换x,y坐标
// 2. 镜像 x轴中心对称
func rotate(matrix [][]int) {
	d := len(matrix)
	for x := 0; x < d; x++ {
		for y := x; y < d; y++ {
			matrix[x][y], matrix[y][x] = matrix[y][x], matrix[x][y]
		}
	}
	for x := 0; x < d/2; x++ {
		for y := 0; y < d; y++ {
			matrix[y][x], matrix[y][d-1-x] = matrix[y][d-1-x], matrix[y][x]
		}
	}
}
