# 20. 有效的括号

# 题目

```
https://leetcode.cn/problems/valid-parentheses/description/
```

# 思路

栈匹配

# 代码

```go
func isValid(s string) bool {
    stack := make([]rune, 0)
    for _, char := range s {
        if char == '(' || char == '{' || char == '[' {
            stack = append(stack, char)
            continue 
        } 
        if len(stack) == 0 {
            return false 
        }
        stackTopChar := stack[len(stack)-1]
        stack = stack[0:len(stack)-1]
        if char == ')' && stackTopChar != '(' {
            return false 
        } else if char == ']' && stackTopChar != '[' {
            return false 
        } else if char == '}' && stackTopChar != '{' {
            return false 
        }
    }
    return len(stack) == 0 
}
```



