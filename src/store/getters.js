export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
/* 推荐 */
export const disc = state => state.disc

/* 排行 */
export const topList = state => state.topList

/*  搜索历史 */
export const searchHistory = state => state.searchHistory

/* 收藏历史 */
export const favoriteHistory = state => state.favoriteHistory

/* 最近播放历史 */
export const playHistory = state => state.playHistory