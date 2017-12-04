import * as types from './mutation-types'

// singer 组件 播放歌曲所需数据
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 查找当前列表中是否有某首歌曲并返回其索引
/**
 * [findIndex description]
 * @param  {[Array]} list [{id: 1, name: 'a'}, {id: 2, name: 'b'}]
 * @param  {[Object]} song {id: 1, name: 'a'}
 * @return {[Number]}      index
 */
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// search 组件播放歌曲所需数据
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