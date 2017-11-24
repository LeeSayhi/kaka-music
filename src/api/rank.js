import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'

// 排行榜
export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 排行榜歌曲
export function getSongList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    format: 'json',
    platform: 'h5',
    tpl: 3,
    needNewCode: 1,
    page: 'detail',
    type: 'top'
  })

  return jsonp(url, data, options)
}