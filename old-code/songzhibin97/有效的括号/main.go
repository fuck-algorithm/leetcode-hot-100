package main

func isValid(s string) bool {
	stack := make([]rune, 0)
	for _, v := range s {
		switch v {
		case '(':
			stack = append(stack, ')')
		case '[':
			stack = append(stack, ']')
		case '{':
			stack = append(stack, '}')

		case ')', ']', '}':
			if len(stack) == 0 || stack[len(stack)-1] != v {
				return false
			}
			stack = stack[:len(stack)-1]
		}
	}
	return len(stack) == 0
}
