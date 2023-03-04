package main

import "fmt"

type MinStack struct {
	min []int
	val []int
}

func Constructor() MinStack {
	return MinStack{}
}

func (this *MinStack) Push(val int) {
	od := val
	if len(this.min) != 0 && od > this.min[len(this.min)-1] {
		od = this.min[len(this.min)-1]
	}
	this.min = append(this.min, od)
	this.val = append(this.val, val)
}

func (this *MinStack) Pop() {
	this.min = this.min[:len(this.min)-1]
	this.val = this.val[:len(this.val)-1]
}

func (this *MinStack) Top() int {
	return this.val[len(this.val)-1]
}

func (this *MinStack) GetMin() int {
	return this.min[len(this.min)-1]
}

/**
 * Your MinStack object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Push(val);
 * obj.Pop();
 * param_3 := obj.Top();
 * param_4 := obj.GetMin();
 */

func main() {
	v := Constructor()
	v.Push(-2)
	v.Push(0)
	v.Push(-3)
	fmt.Println(v)
}
