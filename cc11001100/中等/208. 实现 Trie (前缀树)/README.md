# 208. 实现 Trie (前缀树)

# 题目

```
https://leetcode.cn/problems/implement-trie-prefix-tree/description/
```

# 思路

```go
type Trie struct {
    root *Node 
}

func Constructor() Trie {
    return Trie{
        root: NewNode(), 
    }
}

func (this *Trie) Insert(word string)  {
    currentNode := this.root 
    for _, char := range word {
        if _, exists := currentNode.ChildrenMap[char]; !exists {
            currentNode.ChildrenMap[char] = &Node{
                ChildrenMap: make(map[rune]*Node, 0),
                Value: char,
                Count: 0, 
            }
        }
        currentNode = currentNode.ChildrenMap[char]
    }
    // 表示从根节点到当前节点的路径出现了一次 
    currentNode.Count++ 
}

func (this *Trie) Search(word string) bool {
    currentNode := this.root 
    for _, char := range word {
        // 如果中间节点都没有出现过的话，则直接认为后面的也都没有出现过，所以就没必要再继续了 
        if _, exists := currentNode.ChildrenMap[char]; !exists {
            return false 
        }
        currentNode = currentNode.ChildrenMap[char]
    }
    // 末尾节点的那个字符数的Count不为0，说明之前出现过，否则就是别人的路径，自己只是个前缀 
    return currentNode.Count != 0 
}

func (this *Trie) StartsWith(prefix string) bool {
    currentNode := this.root 
    for _, char := range prefix {
        // 如果中间节点都没有出现过的话，则直接认为后面的也都没有出现过，所以就没必要再继续了 
        if _, exists := currentNode.ChildrenMap[char]; !exists {
            return false 
        }
        currentNode = currentNode.ChildrenMap[char]
    }
    // 只要能拿到最后一个节点，这个前缀就出现过 
    return true 
}

type Node struct {
    Value rune 
    Count int 
    ChildrenMap map[rune]*Node 
}

func NewNode() *Node {
    return &Node{
        ChildrenMap: make(map[rune]*Node, 0), 
    }
}


/**
 * Your Trie object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Insert(word);
 * param_2 := obj.Search(word);
 * param_3 := obj.StartsWith(prefix);
 */
```







