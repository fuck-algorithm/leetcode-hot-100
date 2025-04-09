package main

import (
	"testing"
)

// 236. 二叉树的最近公共祖先
// 记录每个节点的祖先路径
// 所有 Node.val 互不相同 。
// p != q
// p 和 q 均存在于给定的二叉树中
func TestProcess(t *testing.T) {
	//root := transportCase2Tree("[3,5,1,6,2,0,8,null,null,7,4]")
	//mp := process(root)
	//t.Log(mp)
}

func TestGetTreeNodePtrByVal(t *testing.T) {
	//root := transportCase2Tree("[3,5,1,6,2,0,8,null,null,7,4]")
	//mp := getTreeValMap(root)
	//t.Log(mp)
}
func TestLowestCommonAncestor(t *testing.T) {
	var ret *TreeNode
	//ret = lowestCommonAncestor(transportCase2Tree("[3,5,1,6,2,0,8,null,null,7,4]"), transportCase2Tree("[5]"), transportCase2Tree("[1]"))
	//
	//ret = lowestCommonAncestor(transportCase2Tree("[3,5,1,6,2,0,8,null,null,7,4]"), transportCase2Tree("[5]"), transportCase2Tree("[4]"))
	//
	//root := transportCase2Tree("[-1,0,null,1,null,2,null,3,null,4,null,5,null,6,null,7]")
	//mp := getTreeValMap(root)
	//ret = lowestCommonAncestorRescur(root, mp[9999], mp[9998])
	//t.Log(ret.Val)

	//ret = lowestCommonAncestor1(root, 113, 114)
	t.Log(ret.Val)
}

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
	return lowestCommonAncestor1(root, p.Val, q.Val)
}

// 还得是递归，合并重复操作。
func lowestCommonAncestorRescur(root *TreeNode, p, q *TreeNode) *TreeNode {
	if root == nil || root == p || root == q {
		return root
	}
	l := lowestCommonAncestorRescur(root.Left, p, q)
	r := lowestCommonAncestorRescur(root.Right, p, q)
	if l != nil && r != nil {
		return root
	}
	if l == nil {
		return r
	}
	if r == nil {
		return l
	}
	return root
}

// 暴力记忆： 这种方式会报内存超出
// runtime: out of memory: cannot allocate 4194304-byte block (469499904 in use)
// fatal error: out of memory
func lowestCommonAncestor1(root *TreeNode, p, q int) *TreeNode {
	if root == nil || root.Val == q || root.Val == p {
		return root
	}
	mp := process(root)
	pathP := getFromMap(mp, p)
	pathQ := getFromMap(mp, q)
	var ancestor *TreeNode
	i := 0
	for len(pathQ) > i && len(pathP) > i && pathP[i] == pathQ[i] {
		ancestor = pathP[i]
		i++
	}
	if ancestor == nil {
		return root
	}
	return ancestor
}
func getFromMap(mp map[int]*[]*TreeNode, key int) (ret []*TreeNode) {
	if v, ok := mp[key]; !ok {
		return
	} else {
		ret = *v
	}
	return
}
func process(root *TreeNode) map[int]*[]*TreeNode {
	var ret = make(map[int]*[]*TreeNode)
	var stack []*TreeNode
	if root == nil {
		return ret
	}
	ret[root.Val] = &[]*TreeNode{root}
	stack = append(stack, root)
	for len(stack) > 0 {
		var curLen = len(stack)
		for curLen > 0 {
			par := stack[0]
			stack = stack[1:]
			if par.Left != nil {
				if ret[par.Left.Val] == nil {
					ret[par.Left.Val] = &[]*TreeNode{}
				}
				*ret[par.Left.Val] = append(*ret[par.Left.Val], *ret[par.Val]...)
				*ret[par.Left.Val] = append(*ret[par.Left.Val], par.Left)
				stack = append(stack, par.Left)
			}
			if par.Right != nil {
				if ret[par.Right.Val] == nil {
					ret[par.Right.Val] = &[]*TreeNode{}
				}
				*ret[par.Right.Val] = append(*ret[par.Right.Val], *ret[par.Val]...)
				*ret[par.Right.Val] = append(*ret[par.Right.Val], par.Right)
				stack = append(stack, par.Right)
			}
			curLen--
		}

	}
	return ret

}

// 在一个没有重复值的二叉树中，根据val拿到对应的node指针
func getTreeValMap(root *TreeNode) (ret map[int]*TreeNode) {
	ret = make(map[int]*TreeNode)
	var dfs func(root *TreeNode)
	dfs = func(root *TreeNode) {
		if root == nil {
			return
		}
		ret[root.Val] = root
		dfs(root.Left)
		dfs(root.Right)
	}
	dfs(root)
	return ret
}
