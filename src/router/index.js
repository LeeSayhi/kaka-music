import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import singer from 'components/singer/singer'
import rank from 'components/rank/rank'
import search from 'components/search/search'

import singerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'recommend'
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: rank
    },
    {
      path: 'search',
      component: search
    }
  ]
})