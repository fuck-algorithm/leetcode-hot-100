package main

//Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补完和拼写检查。
//
//请你实现 Trie 类：
//
//Trie() 初始化前缀树对象。
//void insert(String word) 向前缀树中插入字符串 word 。
//boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
//boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。

type Trie struct {
	Child [26]*Trie
	IsEnd bool
}

func Constructor() Trie {
	return Trie{}
}

func (this *Trie) Insert(word string) {
	cur := this
	for _, c := range word {
		if cur.Child[c-'a'] == nil {
			cur.Child[c-'a'] = &Trie{}
		}
		cur = cur.Child[c-'a']
	}
	cur.IsEnd = true
}

func (this *Trie) Search(word string) bool {
	cur := this
	for _, c := range word {
		if cur.Child[c-'a'] == nil {
			return false
		}
		cur = cur.Child[c-'a']
	}
	return cur.IsEnd
}

func (this *Trie) StartsWith(prefix string) bool {
	cur := this
	for _, c := range prefix {
		if cur.Child[c-'a'] == nil {
			return false
		}
		cur = cur.Child[c-'a']
	}
	return true
}

/**
 * Your Trie object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Insert(word);
 * param_2 := obj.Search(word);
 * param_3 := obj.StartsWith(prefix);
 */
//["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
//[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
//输出
//[null, null, true, false, true, null, true]
//
//解释
//Trie trie = new Trie();
//trie.insert("apple");
//trie.search("apple");   // 返回 True
//trie.search("app");     // 返回 False
//trie.startsWith("app"); // 返回 True
//trie.insert("app");
//trie.search("app");     // 返回 True
