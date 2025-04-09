package main

//整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。
//
//例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。
//整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。
//更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，
//那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。
//如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。
//例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。
//类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。
//而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。
//给你一个整数数组 nums ，找出 nums 的下一个排列。
//
//必须 原地 修改，只允许使用额外常数空间。

// 如果当前序列不是最大的那个序列
// 要找一个左边的较小数和右边的较大数进行交换
// 要让较小数尽量靠右，较大数尽可能的小。
// 设较小数位置为j,应当将arr[j+1,n]之间的元素进行排序，保证序列的变化尽可能最小

// 这个题解牛逼 https://leetcode.cn/problems/next-permutation/solutions/80560/xia-yi-ge-pai-lie-suan-fa-xiang-jie-si-lu-tui-dao-/
func nextPermutation(nums []int) {
	if len(nums) <= 1 {
		return
	}

	i, j, k := len(nums)-2, len(nums)-1, len(nums)-1

	// find: A[i]<A[j]
	for i >= 0 && nums[i] >= nums[j] {
		i--
		j--
	}

	if i >= 0 { // 不是最后一个排列
		// find: A[i]<A[k]
		for nums[i] >= nums[k] {
			k--
		}
		// swap A[i], A[k]
		nums[i], nums[k] = nums[k], nums[i]
	}

	// reverse A[j:end]
	for i, j := j, len(nums)-1; i < j; i, j = i+1, j-1 {
		nums[i], nums[j] = nums[j], nums[i]
	}
}
