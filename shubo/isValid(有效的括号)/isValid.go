package main

import "fmt"

// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
//
// 有效字符串需满足：
//
// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 每个右括号都有一个对应的相同类型的左括号。

// 利用栈的特性
func isValid(s string) bool {
	if len(s) < 2 {
		return false
	}

	dict := map[byte]byte{
		'(': ')',
		'{': '}',
		'[': ']',
	}
	var stack []byte
	for _, c := range s {
		if _, ok := dict[byte(c)]; ok {
			stack = append(stack, byte(c))
		} else {
			if len(stack) == 0 {
				return false
			}
			if dict[stack[len(stack)-1]] == byte(c) {
				stack = stack[:len(stack)-1]
				continue
			} else {
				return false
			}
		}
	}
	return len(stack) == 0
}

// 这样不可行 ，这样只能匹配到成对存在，但不能保证左右闭合
//
//	func isValid1(s string) bool {
//		if len(s) < 2 {
//			return false
//		}
//
//		dict := map[byte]int32{
//			'(': ')' - '(',
//			'{': '}' - '{',
//			'[': ']' - '[',
//		}
//		var sum int32 = 0
//		for _, c := range s {
//			if x, ok := dict[byte(c)]; ok {
//				sum += c + x
//			} else {
//				sum -= c
//
//			}
//		}
//		return sum == 0
//	}
func main() {
	fmt.Println(isValid("(){}}{"))
	fmt.Println(isValid("){"))
	fmt.Println(isValid("(("))
	fmt.Println(isValid("()"))
	fmt.Println(isValid("(]"))
	fmt.Println(isValid("()[]{}"))

	//fmt.Println(isValid1("(){}}{"))
	//fmt.Println(isValid1("([)]"))
	//fmt.Println(isValid1("){"))
	//fmt.Println(isValid1("(("))
	//fmt.Println(isValid1("()"))
	//fmt.Println(isValid1("(]"))
	//fmt.Println(isValid1("()[]{}"))

}
