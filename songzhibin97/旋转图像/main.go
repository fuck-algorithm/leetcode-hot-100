package main

func rotate(matrix [][]int) {
	start, end := 0, len(matrix)-1
	for start < end {
		matrix[start], matrix[end] = matrix[end], matrix[start]
		start++
		end--
	}

	for i := 0; i < len(matrix); i++ {
		for j := 0; j < i; j++ {
			if i == j {
				continue
			}
			matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
		}
	}
}

func main() {
	rotate([][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}})
}
