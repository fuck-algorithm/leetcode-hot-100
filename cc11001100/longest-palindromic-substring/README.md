# 5. 最长回文子串

题目：
```text
https://leetcode.cn/problems/longest-palindromic-substring/?favorite=2cktkvj
```

代码：
```go
func longestPalindrome(s string) string {
    ans := "" 
    for index, _ := range s {
        s := huiWenLength(s, index)
        if len(s) > len(ans) {
            ans = s 
        }
    }
    return ans 
}

// 从这个下标为中心计算回文子串的话应该怎么做
func huiWenLength(s string, index int) string {
    left, right := index, index 
    for left>=0 && s[left] == s[index]{
        left--
    }
    for right<len(s) && s[right] == s[index] {
        right++ 
    }
    for left>=0 && right<len(s) && s[left] == s[right] {
        left--
        right++ 
    }
    return s[left+1:right]
}
```


