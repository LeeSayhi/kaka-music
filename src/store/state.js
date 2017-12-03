import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

const state = {
	singer: {}, // 歌手信息
  playing: false, // 播放 暂停
  fullScreen: false,  // 全屏播放
  playList: [],  // 播放列表
  sequenceList: [],  // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放索引
  disc: [],  // 推荐歌单
  topList: [], // 排行
  searchHistory: loadSearch()  // 搜索历史
}

export default state