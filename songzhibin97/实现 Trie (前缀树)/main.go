package main

type Trie struct {
	vs    map[rune]*Trie
	Val   string
	IsEnd bool
}

func Constructor() Trie {
	return Trie{
		vs: make(map[rune]*Trie),
	}
}

func (this *Trie) Insert(word string) {
	vs := this
	for _, v := range word {
		if vs.vs[v] == nil {
			vs.vs[v] = &Trie{
				vs:    make(map[rune]*Trie),
				IsEnd: false,
			}
		}
		vs = vs.vs[v]
	}
	vs.Val = word
	vs.IsEnd = true
}

func (this *Trie) Search(word string) bool {
	vs := this
	for _, v := range word {
		if vs.vs[v] == nil {
			return false
		}
		vs = vs.vs[v]
	}
	return vs.IsEnd
}

func (this *Trie) StartsWith(prefix string) bool {
	vs := this
	for _, v := range prefix {
		if vs.vs[v] == nil {
			return false
		}
		vs = vs.vs[v]
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
