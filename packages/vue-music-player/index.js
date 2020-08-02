// 引入组件
import vuePlayAudio from './src/index'

vuePlayAudio.install = Vue => {
  // 扩展 vue 插件
  const AudioController= Vue.extend(vuePlayAudio);
  var instance = new AudioController().$mount(document.createElement('div'))

  Vue.prototype.IS_PLAY = false // 是否播放，默认为：false
  Vue.prototype.CURRENTINDEX = 0 // 当前播放下标

  Vue.prototype.$initAudio = (option) => {
    // 模板赋值
    // instance.message = option.msg;
    // instance.visible = true;
    instance.setData(option)
    if(option.isPlay){
      instance.playAudio()
    }

    // 添加到 body 后面
    document.body.appendChild(instance.$el)
    // instance.$mount(instance.$el)
  }

  Vue.prototype.$playAudio = () => {
    instance.playAudio()
  }

  Vue.prototype.$pauseAudio = () => {
    instance.pauseAudio()
  }

  Vue.prototype.$audioClose = () => {
    document.body.removeChild(instance.$el)
    instance.playList = []
    instance.currentIndex = 0
    instance.clearData()

    // setTimeout(()=>{
    //   instance.visible = false;
    //   document.body.removeChild(instance.$el)
    // }, option.duration)
  }

  Vue.component(vuePlayAudio.name, vuePlayAudio)
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(vuePlayAudio);
}

export default vuePlayAudio;