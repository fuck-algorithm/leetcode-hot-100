# 155. 最小栈

# 一、题目描述

题目链接：
```text
https://leetcode.cn/problems/min-stack/description/?favorite=2cktkvj
```


设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类:

- `MinStack()` 初始化堆栈对象。
- `void push(int val)` 将元素val推入堆栈。
- `void pop()` 删除堆栈顶部的元素。
- `int top()` 获取堆栈顶部的元素。
- `int getMin()` 获取堆栈中的最小元素。

 

**示例 1:**

```
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]

解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
```

 

**提示：**

- `-231 <= val <= 231 - 1`
- `pop`、`top` 和 `getMin` 操作总是在 **非空栈** 上调用
- `push`, `pop`, `top`, and `getMin`最多被调用 `3 * 104` 次



# 二、思路分析

栈的每个层级额外持有一个从栈底到当前层级的最小的值，在获取最小值的时候就直接返回这个值，即可实现O(1)的复杂度。

# 三、AC代码

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















