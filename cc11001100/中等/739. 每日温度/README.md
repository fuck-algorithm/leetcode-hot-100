# 每日温度

题目：
```text
https://leetcode.cn/problems/daily-temperatures/submissions/
```

代码：
```go
func dailyTemperatures(temperatures []int) []int {
    // // 思路一：暴力一把梭，没梭过去 
    // ans := make([]int, len(temperatures))
    // for index, value := range temperatures {
    //     for i:=index+1; i<len(temperatures); i++ {
    //         if temperatures[i] > value {
    //             ans[index] = i - index 
    //             break 
    //         }
    //     }
    // }
    // return ans 
    // 思路二： 单调栈 
    ans := make([]int, len(temperatures))
    stack := make([][]int, 0)
    for index, value := range temperatures {
        // 当栈不为空的时候，把栈顶小于当前元素的全部出栈 
        for len(stack) != 0 {
            top := stack[len(stack)-1]
            if value > top[1] {
                // 出栈，同时设置值 
                stack = stack[0:len(stack)-1]
                ans[top[0]] = index - top[0]
            } else {
                break 
            }
        }
        stack = append(stack, []int{index, value})
    }
    return ans 
}
```