import Vue from 'vue'
import App from './App.vue'

// 全局引用
// import pkgName from '../packages/index'
// Vue.use(pkgName)

// 单独引入
import vueMusicPlayer from '../packages/vue-music-player'
Vue.use(vueMusicPlayer)

new Vue({
  el: '#app',
  render: h => h(App)
})
