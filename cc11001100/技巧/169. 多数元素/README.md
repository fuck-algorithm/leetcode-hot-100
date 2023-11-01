# 169. 多数元素

# 题目 

```text
https://leetcode.cn/problems/majority-element/description/
```

# 思路 

日他妈，先过了再说

```go
func majorityElement(nums []int) int {
    countMap := make(map[int]int, 0)
    for _, n := range nums {
        countMap[n] = countMap[n] + 1 
    }
    fuck := len(nums) / 2 
    for key, count := range countMap {
        if count > fuck {
            return key 
        }
    }
    return -1 
}  
```

好了，现在来摩尔投他妈的票：

```go
func majorityElement(nums []int) int {
    ans := 0 
    count :=  0
    for _, n := range nums {
        if count == 0 {
            ans = n 
            count++
        } else if n == ans {
            count++ 
        } else {
            count--
        }
    }
    return ans 
}  
```





































