import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import singer from 'components/singer/singer'
import rank from 'components/rank/rank'
import search from 'components/search/search'

import singerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer,
      children: [
        {
          path: 'id',
          name: 'singerDetail',
          components: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank
    },
    {
      path: 'search',
      name: 'search',
      component: search
    }
  ]
})