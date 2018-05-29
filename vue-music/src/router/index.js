import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

import Ranking from 'components/ranking/ranking'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer_detail/singer_detail'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      meta: {requiresAuth: true},
      children: [
        {
          path: ':id',
          name: 'detailSinger',
          component: SingerDetail,
          meta: {detailSinger: true}
        }
      ]
    },
    {
      path: '/ranking',
      component: Ranking
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
