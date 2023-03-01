package main

import (
	"container/list"
	"testing"
)

/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func mergeTrees(root1 *TreeNode, root2 *TreeNode) *TreeNode {
	ret := &TreeNode{}
	if root1 == nil {
		return root2
	}
	if root2 == nil {
		return root1
	}
	ret.Val = root1.Val + root2.Val
	ret.Left = mergeTrees(root1.Left, root2.Left)
	ret.Right = mergeTrees(root1.Right, root2.Right)
	return ret
}

func TestMergeTrees(t *testing.T) {
	//输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
	//输出：[3,4,5,5,4,null,7]

	//root1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 5}}, Right: &TreeNode{Val: 2}}
	//root2 := &TreeNode{Val: 2, Left: &TreeNode{Val: 1, Right: &TreeNode{Val: 4}}, Right: &TreeNode{Val: 3, Right: &TreeNode{Val: 7}}}

	//root1 =[1,2,null,3]
	//root2 =	[1,null,2,null,3]
	root1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	root2 := &TreeNode{Val: 1, Right: &TreeNode{Val: 2, Right: &TreeNode{Val: 3}}}
	ret := mergeTrees(root1, root2)
	var retArr = &[]*int{}
	Tree2Array(ret, retArr)
	t.Log(*retArr)
	t.Log(ret)

}

// 数组转树
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
	// 感觉优化遍历条件也能直接避免
	i := len(*ret) - 1
	for ; i > 0; i-- {
		if (*ret)[i-1] != nil {
			break
		}
	}
	*ret = (*ret)[:i]
	return
}

func TestTree2Array(t *testing.T) {
	root1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	var ret = &[]*int{}
	Tree2Array(root1, ret)
	t.Log(*ret)
}
func TestArray2Tree(t *testing.T) {
	t.Log(1)
	//root := Array2Tree([]*int{intPtr(1), intPtr(3), intPtr(2), intPtr(5)})

	root := Array2Tree([]*int{intPtr(1), nil, intPtr(2), nil, intPtr(3)})
	var ret = &[]*int{}
	Tree2Array(root, ret)
	t.Log(*ret)
	t.Log(root)
}
