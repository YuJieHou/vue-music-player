import Vue from 'vue'
import App from './App.vue'

// 单独引入

import vueMusicPlayer from '../packages/vue-music-player'
Vue.use(vueMusicPlayer)

// import vueMusicPlayer from '../lib/vue-music-player'
// Vue.use(vueMusicPlayer)

new Vue({
  el: '#app',
  render: h => h(App)
})
