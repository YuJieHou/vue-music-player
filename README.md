# vue-music-player

这是一个音乐播放器

## 安装

使用npm安装插件：
```
npm i vue-music-player --save
```

然后，在您的 main.js 中，添加：
```
import vueMusicPlayer from 'vue-music-player'
Vue.use(vueMusicPlayer)
```

## 用法

直接通过方法调用即可：
```
let option = {
  playList: [{ // 音频播放列表
    src: '' // 音频路径
  }],
  currentIndex: 0,  //  当前播放音频，所在播放列表的下标
  isPlay: false //  是否初始化的时候播放音频
}
this.$initAudio(option) //  初始化
this.$playAudio() //  开始播放
this.$pauseAudio()  //  暂停播放
this.$audioClose()  //  清除
```
