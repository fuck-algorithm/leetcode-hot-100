# 739. 每日温度

# 一、题目描述

题目：
```text
https://leetcode.cn/problems/daily-temperatures/description/
```



给定一个整数数组 `temperatures` ，表示每天的温度，返回一个数组 `answer` ，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

 

**示例 1:**

```
输入: temperatures = [73,74,75,71,69,72,76,73]
输出: [1,1,4,2,1,1,0,0]
```

**示例 2:**

```
输入: temperatures = [30,40,50,60]
输出: [1,1,1,0]
```

**示例 3:**

```
输入: temperatures = [30,60,90]
输出: [1,1,0]
```

 

**提示：**

- `1 <= temperatures.length <= 105`
- `30 <= temperatures[i] <= 100`



# 二、思路分析

使用单调栈的方式，比如`[73,74,75,71,69,72,76,73]`，最开始的时候的情况：

![image-20231017004735585](README.assets/image-20231017004735585.png)

首先是第1个元素`73`，因为现在栈是空的，所以将其入栈：

![image-20231017005311070](README.assets/image-20231017005311070.png)

然后是第2个元素`74`，将栈顶的元素`73`与其比较，因为栈顶的元素`73`小于`74`，所以将`73`出栈，同时将`73`所对应的下标1的下一个更大的元素位置标记为2：

![image-20231017005652768](README.assets/image-20231017005652768.png)

此时单调栈为空，不需要再比较，将元素`74`压入单调栈：

![image-20231017005747862](README.assets/image-20231017005747862.png)

然后再继续看第3个元素`75`，此时栈顶的元素`74`比它小，则将栈顶的元素出栈，同时将74对应的下标2的下一个更大的元素的位置标记为3：

![image-20231017005908489](README.assets/image-20231017005908489.png)

同时将75入栈：

![image-20231017005926772](README.assets/image-20231017005926772.png)

然后再来看第4个元素71，将它与栈顶的元素75做比较，71更小，所以不对栈顶元素执行出栈操作，而是将71压入栈顶：

![image-20231017010100604](README.assets/image-20231017010100604.png)

然后再来继续看第5个元素69，同样的此时的栈顶元素71不小于69，则直接将69也压入栈顶：

![image-20231017010159400](README.assets/image-20231017010159400.png)

再看第6个元素72，此时栈顶的元素为69，小于72，则将栈顶元素69弹出，同时将其对应的位置的下一个更大的元素标记为6：

![image-20231017010514904](README.assets/image-20231017010514904.png)

继续将72与此时的栈顶元素71比较，将71弹出栈顶，同时标记其对应的下一个更大的元素的下标为6：

![image-20231017010618831](README.assets/image-20231017010618831.png)

此时栈顶的元素75是大于72的，则将72压入栈顶：

![image-20231017010651509](README.assets/image-20231017010651509.png)

然后继续看第7个元素76，同理出栈栈顶元素72：

![image-20231017010736050](README.assets/image-20231017010736050.png)

继续出栈栈顶元素75：

![image-20231017010810334](README.assets/image-20231017010810334.png)

然后将76压入单调栈：

![image-20231017010840909](README.assets/image-20231017010840909.png)

然后看第8个元素73，因为栈顶元素不小于它，所以只是将其压入单调栈：

![image-20231017010919574](README.assets/image-20231017010919574.png)

此时将在单调栈中的元素都出栈，并将其Next数组对应的位置都填充为-1：

![image-20231017011023882](README.assets/image-20231017011023882.png)

为了方便理解将Next数组对应到了下一个更大的元素的下标而不是距离，此时只需要将Next数组转换为距离数组即为答案。

# 三、AC代码

## 3.1 Go

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