# 155. 最小栈

题目：
```text
https://leetcode.cn/problems/min-stack/description/?favorite=2cktkvj
```
代码：
```go
type minStackNode struct {
    value, minValue int 
    next *minStackNode 
}

type MinStack struct {
    top *minStackNode
}


func Constructor() MinStack {
    return MinStack{}
}


func (this *MinStack) Push(val int)  {
    node := &minStackNode{value: val, minValue: val, next: this.top}
    if this.top != nil && this.top.minValue < val {
        node.minValue = this.top.minValue
    }
    this.top = node 
}


func (this *MinStack) Pop()  {
    if this.top != nil {
        newTop := this.top.next 
        this.top.next = nil 
        this.top = newTop 
    }
}


func (this *MinStack) Top() int {
    if this.top != nil {
        return this.top.value 
    } else {
        return 0 
    }
}


func (this *MinStack) GetMin() int {
    if this.top != nil {
        return this.top.minValue 
    } else {
        return 0 
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Push(val);
 * obj.Pop();
 * param_3 := obj.Top();
 * param_4 := obj.GetMin();
 */
```

