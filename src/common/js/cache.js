import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const MAX_LENGTH = 15

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

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
		return item.id === value.id
	})
	if (index > -1) {
		arr.splice(index, 1)
	}
}

// 添加一条数据到 localstorage 的 search 中
export function saveSearch (query) {
	let searches = storage.get(SEARCH_KEY, [])
	insertArray(searches, query, MAX_LENGTH)
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 从 localstorage 的 search 中删除一条数据
export function deleteSearch (query) {
	let searches = storage.get(SEARCH_KEY, [])
	deleteFromArray(searches, query)
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 清空 localstorage 中的 search数据
export function clearSearch () {
	storage.remove(SEARCH_KEY)
	return []
}

// 读取 localstorage 中的 search 数据
export function loadSearch () {
	return storage.get(SEARCH_KEY, [])
}

// 添加一条数据到 localstorage 的 favorite
export function saveFavorite (song) {
	let songs = storage.get(FAVORITE_KEY, [])
	insertArray(songs, song, FAVORITE_MAX_LEN)
	storage.set(FAVORITE_KEY, songs)
	return songs
}

// 从 localstorage 的 favorite 中删除一条数据
export function deleteFavorite (song) {
	let songs = storage.get(FAVORITE_KEY, [])
	deleteFromArray(songs, song)
	storage.set(FAVORITE_KEY, songs)
	return songs
}
// 读取 localstorage 中的 Favorite 数据
export function loadFavorite () {
	return storage.get(FAVORITE_KEY, [])
}

// 添加一条数据到 localstorage 的 play
export function savePlay (song) {
	let plays = storage.get(PLAY_KEY, [])
	insertArray(plays, song, PLAY_MAX_LEN)
	storage.set(PLAY_KEY, plays)
	return plays
}
