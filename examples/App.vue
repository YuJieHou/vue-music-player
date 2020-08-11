<template>
  <div id="app">
    <div>
      <div class="music-list">
        <div>音乐列表</div>
        <div></div>
      </div>
      <h1 @click="initAudio">点击打开音乐</h1>
      <h1 @click="playAudio">点击播放音乐</h1>
      <h1 @click="pauseAudio">点击暂停音乐</h1>
      <div @click="close">点击关闭音乐</div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'app',
  data () {
    return {
      msg: '点击播放音乐',
      musicList: [0, 1, 2, 3, 4, 5]
    }
  },
  methods:{
    initData(){
      const param = {
        all: '周杰伦',
        ft: 'music',
        itemset: 'web_2013',
        client: 'kt',
        pn: 0,
        rn: 5,
        rformat: 'json',
        encoding: 'utf8'
      }
      Axios.get('/r.s', {
        params: param
      }).then(res=>{
        console.log(res)
        console.log(eval('(' + res.data + ')'))
      }).catch(error => {
        console.log(error)
      });
    },
    // 使用
    initAudio(){
      let option = {
        playList: [{
          src: 'http://wechatapppro-1252524126.file.myqcloud.com/appG1VMUALC2470/audio_compressed/1505377565_4fd15d83213bceb23a97ad6af45f1dae.mp3'
        }],
        currentIndex: Math.floor(Math.random() * 1),
        isPlay: true
      }
      this.$initAudio(option)
    },
    playAudio(){
      this.$playAudio()
    },
    pauseAudio(){
      this.$pauseAudio()
    },
    close(){
      this.$audioClose()
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
