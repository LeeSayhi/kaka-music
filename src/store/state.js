import {playMode} from 'common/js/config'

const state = {
	singer: {}, // 歌手信息
  playing: false, // 播放 暂停
  fullScreen: false,  // 全屏播放
  playList: [],  // 播放列表
  sequenceList: [],  // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1  // 当前播放索引
}

export default state