# 647. 回文子串

# 题目

```
https://leetcode.cn/problems/palindromic-substrings/?favorite=2cktkvj
```

# 思路

双指针： 

```go
func countSubstrings(s string) int {
    ans := 0 
    for i:=0; i<len(s); i++ {
        ans += count(s, i)
    }
    return ans 
}

// 统计从i处出发能够得到多少个回文字符串 
func count(s string, i int) int {
    count := 0 
    offset := 0
    for i + offset < len(s) && i - offset >= 0 && s[i+offset] == s[i-offset]{
        count++ 
        offset++ 
    }
    offset = 0
    for i + offset + 1 < len(s) && i - offset >= 0 && s[i+offset+1] == s[i-offset]{
        count++ 
        offset++ 
    }
    return count 
}
```









