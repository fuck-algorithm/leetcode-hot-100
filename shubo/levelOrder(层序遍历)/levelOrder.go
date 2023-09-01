package main

import (
	"container/list"
	"fmt"
)

func levelOrder(root *TreeNode) [][]int {
	if root == nil {
		return [][]int{}
	}
	var queue = []*TreeNode{root}
	var ret [][]int
	for len(queue) > 0 {
		var curLen = len(queue)
		var curLevel []int
		for curLen > 0 {
			curNode := queue[0]
			queue = queue[1:]
			curLevel = append(curLevel, curNode.Val)
			if curNode.Left != nil {
				queue = append(queue, curNode.Left)
			}
			if curNode.Right != nil {
				queue = append(queue, curNode.Right)
			}
			curLen--
		}
		if len(curLevel) != 0 {
			ret = append(ret, curLevel)
		}
	}
	return ret
}
func main() {
	fmt.Println(levelOrder(Array2Tree([]*int{intPtr(3), intPtr(9), intPtr(20), nil, nil, intPtr(15), intPtr(7)})))
	fmt.Println(levelOrder(Array2Tree([]*int{intPtr(1), intPtr(2), intPtr(3), intPtr(4), nil, nil, intPtr(5)})))
	fmt.Println(levelOrder(Array2Tree([]*int{intPtr(3), intPtr(2), intPtr(3), intPtr(4), nil, nil, intPtr(5)})))
}

// 构造 二叉数 输入输出

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// Array2Tree 数组转树
func Array2Tree(bfsArr []*int) (ret *TreeNode) {
	var nodes []*TreeNode
	for _, i := range bfsArr {
		if i == nil {
			nodes = append(nodes, nil)
			continue
		}
		nodes = append(nodes, &TreeNode{Val: *i})
	}
	var idx = 0
	for _, node := range nodes {
		if node == nil {
			continue
		}
		if 2*idx+1 < len(nodes) {
			node.Left = nodes[2*idx+1]
		}
		if 2*idx+2 < len(nodes) {
			node.Right = nodes[2*idx+2]
		}
		idx++
	}
	return nodes[0]
}

func intPtr(val int) *int {
	return &val
}

// 树转数组
func Tree2Array(root *TreeNode, ret *[]*int) {
	q := list.New()
	if root == nil {
		*ret = append(*ret, nil)
		return
	}
	q.PushFront(root)
	for q.Len() != 0 {
		curr := q.Back()
		if curr.Value == nil {
			*ret = append(*ret, nil)
			q.Remove(curr)
			continue
		}
		q.Remove(curr)
		*ret = append(*ret, intPtr(curr.Value.(*TreeNode).Val))
		if curr.Value.(*TreeNode).Left != nil {
			q.PushFront(curr.Value.(*TreeNode).Left)
		} else {
			q.PushFront(nil)
		}
		if curr.Value.(*TreeNode).Right != nil {
			q.PushFront(curr.Value.(*TreeNode).Right)
		} else {
			q.PushFront(nil)
		}
	}
	// 清理尾部多余的nil
	i := len(*ret) - 1
	for ; i > 0; i-- {
		if (*ret)[i-1] != nil {
			break
		}
	}
	*ret = (*ret)[:i]
	return
}
