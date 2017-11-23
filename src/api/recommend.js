import axios from 'axios'
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

// 轮播图数据
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 推荐列表数据
export function getDiscList () {
  let url = 'api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 推荐歌单
export function getSongList (disstid, num) {
  let url = 'api/getSongList'

  const data = Object.assign({}, commonParams, {
    disstid,
    platform: 'h5',
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosing: 0,
    song_begin: 0,
    song_num: num,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}