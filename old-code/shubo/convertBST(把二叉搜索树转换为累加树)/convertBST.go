package main

import (
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"strings"
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// 给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。
//
// 提醒一下，二叉搜索树满足下列约束条件：
//
// 节点的左子树仅包含键 小于 节点键的节点。
// 节点的右子树仅包含键 大于 节点键的节点。
// 左右子树也必须是二叉搜索树。
// 注意：本题和 1038: https://leetcode-cn.com/problems/binary-search-tree-to-greater-sum-tree/ 相同
func convertBST(root *TreeNode) *TreeNode {
	sum := 0
	var dfs func(*TreeNode)
	dfs = func(node *TreeNode) {
		if node != nil {
			dfs(node.Right)
			sum += node.Val
			node.Val = sum
			dfs(node.Left)
		}
	}
	dfs(root)
	return root
}

// 等比数列通项公式
// S(n) = a1(1-q^n)/(1-q)
// 推导过程（突出一个裂项错位相消）：
// S(n) = a1+a2+...+a(n)
// S(n) = a1+a1*q+...+a1*q^(n-1)
// qS(n) = a2+a3*q+...+a1*q^(n)
// S(n) - qS(n) = a1 - a1*q^(n) = a1(1-q^(n))
// S(n) * (1-q) = a1(1-q^(n))
// S(n) = a1(1-q^(n))/(1-q)

// 带入常量
// S(n)+1 = 2^(n)
// n =  ln(S(n)+1)/ ln2 = Log2(S(n)+1)

func transportCase2BSTTree(caseStr string) (root *TreeNode) {
	caseStr = strings.ReplaceAll(strings.ReplaceAll(caseStr, "[", ""), "]", "")
	nodes := strings.Split(caseStr, ",")
	Sn := len(nodes)
	if Sn < 1 || nodes[0] == "null" {
		return &TreeNode{}
	}
	root = &TreeNode{Val: *transportElement(nodes[0])}
	dpath := math.Ceil(math.Log2(float64(Sn + 1)))
	stack := []*TreeNode{root}
	for i := 2; i <= int(dpath); i++ {
		l := 1 << (i - 1)
		r := 1<<(i) - 1
		for len(stack) != 0 && l < r {
			par := stack[0]
			stack = stack[1:]
			var lPtr, rPtr *int
			if len(nodes) > l {
				lPtr = transportElement(nodes[l-1])
				rPtr = transportElement(nodes[l])
			}
			if lPtr != nil {
				par.Left = &TreeNode{Val: *lPtr}
				stack = append(stack, par.Left)
			}
			if rPtr != nil {
				par.Right = &TreeNode{Val: *rPtr}
				stack = append(stack, par.Right)
			}
			l += 2
		}
	}
	return
}
func transportElement(str string) *int {
	if str == "null" {
		return nil
	}
	i, err := strconv.Atoi(str)
	if err != nil {
		return nil
	}
	return &i
}
func bst2Array(root *TreeNode) (arr []*int) {
	arr = []*int{}
	if root == nil {
		return
	}
	arr = append(arr, &root.Val)
	stack := []*TreeNode{root}
	for len(stack) != 0 {
		par := stack[0]
		stack = stack[1:]
		if par == nil {
			arr = append(arr, nil, nil)
			continue
		}
		addValOrNil(par.Left, &arr, &stack)
		addValOrNil(par.Right, &arr, &stack)
	}
	// 把最后一层截掉
	return arr[:(1<<(int(math.Log2(float64(len(arr)+1)))-1))-1]
}
func addValOrNil(node *TreeNode, arr *[]*int, stack *[]*TreeNode) {
	*stack = append(*stack, node)
	if node == nil {
		*arr = append(*arr, nil)
	} else {
		*arr = append(*arr, &node.Val)
	}
}
func main() {
	root := transportCase2BSTTree(`[4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]`)
	arrBefore := bst2Array(root)
	b, _ := json.Marshal(arrBefore)
	fmt.Printf("%s\n", string(b))
	arrAfter := bst2Array(convertBST(root))
	bb, _ := json.Marshal(arrAfter)
	fmt.Printf("%s\n", bb)
}
