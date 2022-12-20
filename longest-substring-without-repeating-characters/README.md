#  3. 无重复字符的最长子串

# 题目

```
https://leetcode.cn/problems/longest-substring-without-repeating-characters/?favorite=2cktkvj
```

# 思路

滑动窗口

# 代码

```go
func lengthOfLongestSubstring(s string) int {
    answer := 0 
    left := 0 
    right := 0 
    for right <= len(s) {
        if left == right {
            right++ 
        } else if isOk(s[left:right]) {
            length := right - left 
            if length > answer {
                answer = length 
            }
            right++ 
        } else {
            left++ 
        }
    }
    return answer 
}

func isOk(s string) bool {
    charSet := make(map[rune]struct{})
    for _, char := range s {
        if _, exists := charSet[char]; exists {
            return false 
        } 
        charSet[char] = struct{}{}
    }
    return true 
}
```



