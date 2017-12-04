import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const MAX_LENGTH = 15

/**
 * 检查数组中是否有待插入元素，如果有且第一位，就什么也不做。
 * 如果不是第一位就删除后再将带插入元素插入数组的第一位
 * 如果没有直接插入
 * 如果数组长度 > 15，就删除最后一位
 */
function insertArray (arr, value, maxLength) {
	let index = arr.findIndex((item) => {
		return item === value
	})
	if (index === 0) {
		return
	}
	if (index > 0) {
		arr.splice(index, 1)
	}
	arr.unshift(value)
	if (maxLength && arr.length > maxLength) {
		arr.pop()
	}
}

// 从数组中删除某个值
function deleteFromArray (arr, value) {
	let index = arr.findIndex((item) => {
		return item === value
	})
	arr.splice(index, 1)
}

export function saveSearch (query) {
	let searches = storage.get(SEARCH_KEY, [])
	insertArray(searches, query, MAX_LENGTH)
	storage.set(SEARCH_KEY, searches)
	return searches
}

export function deleteSearch (query) {
	let searches = storage.get(SEARCH_KEY, [])
	deleteFromArray(searches, query)
	storage.set(SEARCH_KEY, searches)
	return searches
}

export function clearSearch () {
	storage.remove(SEARCH_KEY)
	return []
}

export function loadSearch () {
	return storage.get(SEARCH_KEY, [])
}