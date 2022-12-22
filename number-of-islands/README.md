# 200. 岛屿数量

题目： 
```bash
https://leetcode.cn/problems/number-of-islands/description/?favorite=2cktkvj
```

代码：
```go
func numIslands(grid [][]byte) int {
    count := 0 
    for i:=0; i<len(grid); i++ {
        for j:=0; j<len(grid[i]); j++ {
            if grid[i][j] == '1' {
                dfs(grid, i, j)
                count++ 
            }
        }
    }
    return count 
}

func dfs(grid [][]byte, i, j int) {
    if i < 0 || i >= len(grid) || j < 0 || j >= len(grid[i]) {
        return 
    }
    if grid[i][j] != '1' {
        return 
    }
    grid[i][j] = byte('2')
    dfs(grid, i+1, j)
    dfs(grid, i, j+1)
    dfs(grid, i-1, j)
    dfs(grid, i, j-1)
}
```

