import * as types from './mutation-types'
import {saveSearch, deleteSearch, clearSearch, saveFavorite, deleteFavorite, savePlay} from 'common/js/cache'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// singer 组件 播放歌曲所需数据
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit, state}, list) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

/**
 * 查找当前列表中是否有某首歌曲并返回其索引
 * [findIndex description]
 * @param  list [{id: 1, name: 'a'}, {id: 2, name: 'b'}]
 * @param  song {id: 1, name: 'a'}
 * @return index
 */
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 播放歌曲所需数据 （插入一首歌）
export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice()  // vuex 不能在 mutations 的回调函数外边修改，所以用 slice() 创建一个副本
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playList, song)
  // 因为是插入歌曲，所以索引+1 （在当前正在播放的歌曲后一位位置插入）
  currentIndex++
  // 插入这首歌到当前索引位置，假如当前播放的歌曲为 playList 中的 b， [a,b,c].splice(2,0,d) -> [a,b,d,c]
  playList.splice(currentIndex, 0, song)
  // 如果 playList 中已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号（原来这首歌的索引位置不会发生变化）
    if (currentIndex > fpIndex) {
      // 删除列表中原来的这首歌
      playList.splice(fpIndex, 1)
      // 因为删除了原来这首歌，数组长度-1，所以索引也要-1
      currentIndex--
    } else {
      // 删除列表中原来的这首歌，（因为当前插入的序号小于列表中的序号，所以原来这首歌索引+1位置的删除)
      playList.splice(fpIndex + 1, 1)
    }
  }

  // 待插入sequenceList 的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  // sequenceList 中是否有待插入的歌曲
  let fsIndex = findIndex(sequenceList, song)
  // 插入这首歌
  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索历史数据缓存
export const saveSearchHistory = function ({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除某一条搜索历史数据
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空搜索历史数据
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 播放列表中删除某首歌曲
export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.playList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playList, song)

  playList.splice(pIndex, 1)

  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

// 清空播放列表
export const clearSongList = function ({commit}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 收藏
export const saveFavoriteHistory = function ({commit}, song) {
  commit(types.SET_FAVORITE_HISTORY, saveFavorite(song))
}

// 取消收藏
export const deleteFavoriteHistory = function ({commit}, song) {
  commit(types.SET_FAVORITE_HISTORY, deleteFavorite(song))
}

// 当播放一首歌时添加到最近播放
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}