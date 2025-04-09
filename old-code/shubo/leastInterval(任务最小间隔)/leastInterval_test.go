package main

import "testing"

// 相同的任务必须有n个冻结时间
// 思路： 题解 https://leetcode.cn/problems/task-scheduler/solutions/1924711/by-ac_oier-3560/
// 先优先吧重复次数最多的任务拿出来，记做m个
// 则这m个需要花费的时间为 (n+1)*(m-1)+1
// 将最大任务数记做m，共有t个最大任务数
// 综上：如果  剩余其他的任务数不超过 (n+1)*(m-1)+t，则无需额外多花时间，如果超出了(n+1)*(m-1)+t则横向增加，也不会引入额外时间

// 1 <= task.length <= 104
// tasks[i] 是大写英文字母
// n 的取值范围为 [0, 100]
func leastInterval(tasks []byte, n int) int {
	var b [26]int
	for _, task := range tasks {
		b[task-'A']++
	}
	m, t := 0, 0
	for _, i := range b {
		m = max(i, m)
	}
	for _, i := range b {
		if i == m {
			t++
		}
	}
	return max(len(tasks), (n+1)*(m-1)+t)
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// 输入：tasks = ["A","A","A","B","B","B"], n = 2
// 输出：8
// 解释：A -> B -> (待命) -> A -> B -> (待命) -> A -> B
// 在本示例中，两个相同类型任务之间必须间隔长度为 n = 2 的冷却时间，而执行一个任务只需要一个单位时间，所以中间出现了（待命）状态。
func TestLeastInterval(t *testing.T) {
	//t.Log(leastInterval([]byte("AAABBB"), 2))
	t.Log(leastInterval([]byte("AABCDEFGHIJKLMNOPQRSTUVWXYZ"), 29))

}
