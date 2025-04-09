package main

import "testing"

func TestCase(t *testing.T) {
	//t.Log(dailyTemperaturesBaoli([]int{73, 74, 75, 71, 69, 72, 76, 73}))
	t.Log(dailyTemperatures([]int{73, 74, 75, 71, 69, 72, 76, 73}))
	t.Log(dailyTemperatures([]int{73, 73, 73, 73}))
}

// 给定一个整数数组 temperatures ，
// 表示每天的温度，返回一个数组 answer ，
// 其中 answer[i] 是指对于第 i 天，
// 下一个更高温度出现在几天后。
// 如果气温在这之后都不会升高，请在该位置用 0 来代替。

// 单调栈
func dailyTemperatures(temperatures []int) []int {
	var stack []int
	var ans = make([]int, len(temperatures))
	for i, t := range temperatures {
		if len(stack) == 0 || temperatures[stack[len(stack)-1]] > t {
			stack = append(stack, i)
			continue
		} else {
			for len(stack) > 0 && temperatures[stack[len(stack)-1]] < t {
				top := stack[len(stack)-1]
				stack = stack[:len(stack)-1]
				ans[top] = i - top
			}
			stack = append(stack, i)
		}

	}

	return ans
}

// 超出时间限制
func dailyTemperaturesBaoli(temperatures []int) []int {
	var ans = make([]int, len(temperatures))
	for i := 0; i < len(temperatures)-1; i++ {
		for j := i + 1; j < len(temperatures); j++ {
			if temperatures[i] < temperatures[j] {
				ans[i] = j - i
				break
			}
		}
	}
	return ans
}

//示例 1:
//
//输入: temperatures = [73,74,75,71,69,72,76,73]
//输出: [1,1,4,2,1,1,0,0]
//示例 2:
//
//输入: temperatures = [30,40,50,60]
//输出: [1,1,1,0]
//示例 3:
//
//输入: temperatures = [30,60,90]
//输出: [1,1,0]
