package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func levelOrder(root *TreeNode) [][]int {
	if root == nil {
		return nil
	}
	res := [][]int{}
	q := []*TreeNode{root}
	for len(q) != 0 {
		ln := len(q)
		s := []int{}
		for i := 0; i < ln; i++ {
			p := q[i]
			s = append(s, p.Val)
			if p.Left != nil {
				q = append(q, p.Left)
			}
			if p.Right != nil {
				q = append(q, p.Right)
			}
		}

		q = q[ln:]
		res = append(res, s)
	}
	return res
}
