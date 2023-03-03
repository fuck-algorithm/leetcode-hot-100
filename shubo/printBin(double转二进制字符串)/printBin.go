package main

import (
	"fmt"
	"strings"
)

// 二进制数转字符串。给定一个介于0和1之间的实数（如0.72），类型为double，打印它的二进制表达式。如果该数字无法精确地用32位以内的二进制表示，则打印“ERROR”。

// 思路：
// 左移一位取 整数位 填入向右偏移一位的结果字符串中，循环这个步骤
func printBin(num float64) string {
	if num == 0 {
		return "0"
	}
	b := &strings.Builder{}
	b.WriteString("0.")
	for b.Len() <= 32 && num != 0 {
		num *= 2
		x := byte(num)
		b.WriteByte('0' + x)
		num -= float64(x)
	}
	if b.Len() <= 32 {
		return b.String()
	}
	return "ERROR"
}

func main() {
	fmt.Println(printBin(0.625))
	fmt.Println(printBin(0.123123))
	fmt.Println(printBin(0.25))
}
