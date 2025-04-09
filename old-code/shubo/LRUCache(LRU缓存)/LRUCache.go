package main

import "fmt"

// 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
// 实现 LRUCache 类：
// LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
// 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。

type LRUCache struct {
	m          map[int]*DeListNode
	head, tail *DeListNode
	cap        int
	size       int
}
type DeListNode struct {
	k, v       int
	prev, next *DeListNode
}

func Constructor(capacity int) LRUCache {
	v := LRUCache{
		m:    map[int]*DeListNode{},
		head: &DeListNode{},
		tail: &DeListNode{},
		cap:  capacity,
	}
	v.head.next = v.tail
	v.tail.prev = v.head
	return v
}

// 不存在直接返回-1
// 存在将元素刷新到队尾
func (this *LRUCache) Get(key int) int {
	node, ok := this.m[key]
	if !ok {
		return -1
	}
	this.moveToTail(node)
	return node.v
}
func (this *LRUCache) moveToTail(node *DeListNode) {
	this.deleteNode(node)
	this.appendToTail(node)
}

func (this *LRUCache) appendToTail(node *DeListNode) {
	if node == nil {
		return
	}
	node.prev = this.tail.prev
	node.next = this.tail
	this.tail.prev = node
	node.prev.next = node
}

func (this *LRUCache) deleteNode(node *DeListNode) {
	if node == nil {
		return
	}
	node.prev.next = node.next
	node.next.prev = node.prev
}
func (this *LRUCache) releaseCache() {
	//容量不足则弹出队头，清除对应cache
	if this.size > this.cap {
		node := this.head.next
		this.deleteNode(node)
		delete(this.m, node.k)
		this.size--
	}
}

// Put
// 如果已经存在，更新val并则刷新到队尾
// 如果不存在，检查容量，容量不足则弹出队头，清除对应cache
// 然后入队
func (this *LRUCache) Put(key int, value int) {
	if node, ok := this.m[key]; ok {
		node.v = value
		this.deleteNode(node)
		this.moveToTail(node)
	} else {
		newNode := &DeListNode{k: key, v: value}
		this.m[key] = newNode
		this.appendToTail(newNode)
		this.size++
		//容量不足则弹出队头，清除对应cache
		this.releaseCache()
		// 入队
	}
}

//输入
//["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
//[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
//输出
//[null, null, null, 1, null, -1, null, -1, 3, 4]
//
//解释
//LRUCache lRUCache = new LRUCache(2);
//lRUCache.put(1, 1); // 缓存是 {1=1}
//lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
//lRUCache.get(1);    // 返回 1
//lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
//lRUCache.get(2);    // 返回 -1 (未找到)
//lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
//lRUCache.get(1);    // 返回 -1 (未找到)
//lRUCache.get(3);    // 返回 3
//lRUCache.get(4);    // 返回 4

func main() {
	obj := Constructor(2)
	obj.Put(1, 1)
	obj.Put(2, 2)
	fmt.Println(obj.Get(1))
	obj.Put(3, 3)
	fmt.Println(obj.Get(2))
	obj.Put(4, 4)
	fmt.Println(obj.Get(1))
	fmt.Println(obj.Get(3))
	fmt.Println(obj.Get(4))
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * obj := Constructor(capacity);
 * param_1 := obj.Get(key);
 * obj.Put(key,value);
 */
