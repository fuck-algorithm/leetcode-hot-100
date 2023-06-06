package main

import (
	"testing"
)

// 在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。

// dfs 搜索每一个点
// 如果向右向下能构成正方形，记录最大变长
// 麻痹超时了
// func maximalSquare(matrix [][]byte) int {
//
//		var dfs func(i, j, long, width int) (ans int)
//
//		dfs = func(i, j, long, width int) (ans int) {
//			var m = 0
//			if i >= len(matrix) {
//				return long - 1
//			}
//			if j >= len(matrix[0]) {
//				return width - 1
//			}
//			if matrix[i][j] == '0' {
//				_, ans = minmax(long, width)
//				return ans - 1
//			}
//			l := dfs(i+1, j, long+1, width)
//			r := dfs(i, j+1, long, width+1)
//			mm, _ := minmax(l, r)
//			_, m = minmax(m, mm)
//			return m
//		}
//		ans := 0
//		for i := 0; i < len(matrix); i++ {
//			for j := 0; j < len(matrix[0]); j++ {
//				if matrix[i][j] == '0' {
//					continue
//				}
//				m := dfs(i, j, 1, 1)
//				_, ans = minmax(ans, m)
//			}
//		}
//		return ans * ans
//	}
func minmax(i, j int) (int, int) {
	if i > j {
		return j, i
	}
	return i, j
}

/*
   public int maximalSquare(char[][] matrix) {

       int res=0;
       int n=matrix.length;
       int m=matrix[0].length;
       int dp[][]=new int [n+1][m+1];

       for (int i = 1; i <=n ; i++) {
           for (int j = 1; j <=m; j++) {
               if(matrix[i-1][j-1]!='0' ){
                   if (dp[i][j-1]!=0 && dp[i-1][j]!=0 && dp[i-1][j-1]!=0) {
                       dp[i][j]=(1+Math.min(dp[i][j-1],Math.min(dp[i-1][j],dp[i-1][j-1])));
                   }else {
                       dp[i][j]=1;
                   }
               }
               res=Math.max(res,dp[i][j]);
           }
       }
       return res*res;
   }
*/

// 还得dp
// dp(i,j)=min(dp(i−1,j),dp(i−1,j−1),dp(i,j−1))+1)
func maximalSquare(matrix [][]byte) int {
	ans := 0
	n := len(matrix)
	m := len(matrix[0])
	var dp [][]int
	for i := 0; i <= n; i++ {
		var t []int
		for j := 0; j <= m; j++ {
			t = append(t, 0)
		}
		dp = append(dp, t)
	}

	for i := 1; i <= n; i++ {
		for j := 1; j <= m; j++ {
			if matrix[i-1][j-1] == '0' {
				continue
			}
			if dp[i][j-1] != 0 && dp[i-1][j] != 0 && dp[i-1][j-1] != 0 {
				dp[i][j] = 1 + min(dp[i][j-1], min(dp[i-1][j], dp[i-1][j-1]))
			} else {
				dp[i][j] = 1
			}
			ans = max(ans, dp[i][j])
		}
	}
	return ans * ans
}
func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
func TestMaxSquare(t *testing.T) {
	t.Log(maximalSquare([][]byte{{'1', '0', '1', '0', '0'}, {'1', '0', '1', '1', '1'}, {'1', '1', '1', '1', '1'}, {'1', '0', '0', '1', '0'}}))
}
