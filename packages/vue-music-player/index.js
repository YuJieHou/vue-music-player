// 引入组件
import vueMusicPlay from './src/index'

vueMusicPlay.install = Vue => {
  // 扩展 vue 插件
  const AudioController= Vue.extend(vueMusicPlay);
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
    // instance.$mount(instance.$el)
    document.body.appendChild(instance.$el)
  }

  Vue.prototype.$playAudio = () => {
    instance.playAudio()
  }

  Vue.prototype.$pauseAudio = () => {
    instance.pauseAudio()
  }

  Vue.prototype.$audioClose = () => {
    console.log(instance.$el)
    console.log(document)
    console.log(document.body)
    document.body.removeChild(instance.$el)
    instance.playList = []
    instance.currentIndex = 0
    instance.clearData()

    // setTimeout(()=>{
    //   instance.visible = false;
    //   document.body.removeChild(instance.$el)
    // }, option.duration)
  }

  Vue.component(vueMusicPlay.name, vueMusicPlay)
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(vueMusicPlay);
}

export default vueMusicPlay;
