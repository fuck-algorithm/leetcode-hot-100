package main

// 解法1.排序取中间 时间O(nlogn) 取决与用什么排序算法 空间O(nlogn)
// 解法2.hash 暴力统计 时间O(n) 空间O(n)

// 解法3. boyer-moore投票算法 O(n) 空间O(1)
// 通俗点说就是从第一个数开始 c = 1，遇到相同的就加 1，遇到不同的就减 1，减到 0 就 重新换个数重新计数，最后的那个 m 即为所求众数
func majorityElement(nums []int) int {
	c := 1
	maj := nums[0]
	for i := 1; i < len(nums); i++ {
		if c == 0 {
			maj = nums[i]
			c = 1
			continue
		}
		if maj == nums[i] {
			c++
		} else {
			c--
		}

	}
	return maj
}
func main() {

}
