package main

func longestPalindrome(s string) string {
	// start end
	// start, end:  i  , i
	// start, end:  i-1, i
	// babad
	// cbbd

	res := ""
	mx := 0

	for i := 0; i < len(s); i++ {
		ss := check(i, i, s)
		if len(ss) > mx {
			mx = len(ss)
			res = ss
		}
		if i > 0 && s[i-1] == s[i] {
			ss = check(i-1, i, s)
			if len(ss) > mx {
				mx = len(ss)
				res = ss
			}
		}
	}
	return res
}

func check(start, end int, s string) string {
	ls := len(s)

	if start < 0 || end >= ls {
		return ""
	}
	for start > 0 && end < ls-1 && s[start-1] == s[end+1] {
		start--
		end++
	}
	return s[start : end+1]
}
