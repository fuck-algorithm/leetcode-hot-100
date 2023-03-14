package main

import "fmt"

type DisJoinSet struct {
	Set    []int
	length []int // 长度
	rank   []int // 用于合并优化 按秩合并
}

func Construct(n int) DisJoinSet {
	d := DisJoinSet{Set: make([]int, n), rank: make([]int, n), length: make([]int, n)}
	for i := 0; i < n; i++ {
		d.Set[i] = i
		d.length[i] = 1
	}
	return d
}

func (d *DisJoinSet) Find(x int) int {
	if d.Set[x] != x {
		// 路径压缩
		d.Set[x] = d.Find(d.Set[x])
	}
	return d.Set[x]
}

func (d *DisJoinSet) Join(x, y int) bool {
	x, y = d.Find(x), d.Find(y)
	if x != y {
		if d.rank[x] < d.rank[y] {
			// 转换 小树在前
			x, y = y, x
		}
		d.Set[y] = x
		d.length[x] += d.length[y]
		if d.rank[x] == d.rank[y] {
			d.rank[x]++
		}
		return true
	}
	return false
}

func longestConsecutive(nums []int) int {
	n := Construct(len(nums))
	hash := make(map[int]int)
	for i, num := range nums {
		hash[num] = i
	}
	for val, idx := range hash {
		v, ok := hash[val+1]
		if !ok {
			continue
		}
		n.Join(idx, v)
	}
	ans := 0
	for _, v := range n.length {
		if ans < v {
			ans = v
		}
	}
	return ans
}

func main() {
	fmt.Println(longestConsecutive([]int{100, 4, 200, 1, 3, 2}))
}
