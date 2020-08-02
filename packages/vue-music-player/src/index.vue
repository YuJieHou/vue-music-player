<template>
  <div>
    <audio
      ref="audioPlayer"
      :autoplay="autoplay"
      preload="auto"
      @error="error">
      你的浏览器不支持audio标签
    </audio>
    <h1>{{ isMobile?'移动端':'PC 端' }}</h1>
    <div>
      <div>当前播放列表的下标：{{ currentIndex }}</div>
    </div>
    <div class="music-player-pc music-player-bottom" v-if="!isMobile">
      <div class="music-player-mask">
        <img src="./assets/images/cover_audio.png" alt="">
      </div>
      <div class="music-player music-player-col">
        <div class="music-player-panel music-player-panel-center">
          <div class="music-player-next" @click.stop="next(false)">
            <img src="./assets/images/btn_last.png" />
          </div>
          <div>
            <div v-if="!isLoading">
              <div class="music-player-pause" @click="playPauseAudio(false)" v-if="isPlay">
                <img src="./assets/images/btn_list_pause_select.png" />
              </div>
              <div class="music-player-play" @click="playPauseAudio(true)" v-else>
                <img src="./assets/images/btn_list_play.png" />
              </div>
            </div>
            <div v-else>
              <div class="music-player-load">加载中</div>
            </div>
          </div>
          <div class="music-player-next" @click.stop="next(true)">
            <img src="./assets/images/btn_next.png" />
          </div>
          <div class="music-player-head">
            <img src="./assets/images/cover_audio.png" alt="">
          </div>
          <div class="music-player-info">
            <div>
              <div>
                <span>音乐名称</span>
              </div>
              <div>
                <span>{{ audioAllDuration | formatTime }}</span>
                <span> / </span>
                <span>{{ audioCurrentTime | formatTime }}</span>
              </div>
            </div>
            <div>
              <div> {{ audioBuffered }} - {{ audioAllDuration }} - {{ audioBuffered / audioAllDuration | integerNumber }} - {{ (audioCurrentTime / audioAllDuration) | integerNumber }} </div>
            </div>
          </div>
          <div>
            <span v-if="mode === 0"> 顺序 </span>
            <span v-if="mode === 1"> 循环 </span>
            <span v-if="mode === 2"> 随机播放 </span>
            <span class="" @click="changeVolume(0)"> 静音 </span>
            <span class="" @click="changeVolume(1)"> 最大音 </span>
            <span class="" @click="changeSpeed(multipleArray[Math.floor(Math.random() * multipleArray.length)])">倍数：{{ speed }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="music-player-mobile music-player-bottom" v-else>
      <div class="music-player music-player-col">
        <div class="music-player-panel">
          <div>Mobile</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { playMode } from './assets/js/config'
let audioPlayer = null
export default {
  name: 'vue-music-player',
  data () {
    return {
      isPlay: false, // 是否播放，默认为：false
      currentIndex: 0, // 当前播放下标
      playList: [], // 播放列表
      type: 'info', // 播放的类型
      autoplay: false, // 是否自动播放，默认为：false
      isOpen: false, // 是否关闭，默认为：false
      isShow: false, // 是否显示，默认为：false
      isLoading: false,
      multipleArray: [0.75, 1, 1.5, 2], // 倍速设置
      audioInterval: null, // 定时器
      speed: 1, // 默认倍数
      audioAllDuration: 0, // 音频总播放秒数
      audioBuffered: 0, // 音频当前的缓存时长
      audioCurrentTime: 0, // 音频当前播放秒数
      audioLyric: '',
      mode: 0
    }
  },
  filters: {
    formatTime(second) {
      const secondType = typeof second
      if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second)
        const hours = Math.floor(second / 3600);
        second = second - hours * 3600;
        second = second
        const mimute = Math.floor(second / 60)
        second = second - mimute * 60
        return ('0' + hours).slice(-2) + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
      } else {
        return '00:00'
      }
    },
    integerNumber(val){
      if(val >= 0){
        return Number(val.toFixed(3))
      }else{
        return 0
      }
    }
  },
  computed: {
    /**
     * 检测是否为移动端
     */
    isMobile () {
      let userAgentInfo = navigator.userAgent;
      let Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
      let flag = false;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  },
  methods: {
    error() {
      console.log('播放失败')
      this.isLoading = false
    },
    /** 设置定时检测 */
    setAudioInterval() {
      this.audioInterval = setInterval(() => {
        this.getAudioTime();
        if (audioPlayer.ended) {
          this.reastData()
        }
        audioPlayer.paused ? this.isPlay = false : this.isPlay = true
      }, 500)
    },
    reastData(){
      // 播放结束后重置数据
      clearInterval(this.audioInterval);
      this.$refs.audioPlayer.currentTime = 0;
      this.audioCurrentTime = 0
      this.audioAllDuration = 0
      this.audioBuffered = 0
      this.isPlay = false;
    },
    // 清空外界值
    clearData(){
      this.playList = []
      this.currentIndex = 0
      this.reastData()
    },
    //
    setData(option){
      this.playList = option.playList || []
      this.currentIndex = option.currentIndex || 0
      if(this.playList.length === 0 || this.currentIndex < 0 || !this.playList[this.currentIndex].src) return false
      this.$refs.audioPlayer.src = this.playList[this.currentIndex].src
    },
    playPauseAudio(val){
      if(val){
        this.playAudio()
      }else{
        this.pauseAudio()
      }
    },
    /** 播放 */
    playAudio() {
      // 重设定时器
      clearInterval(this.audioInterval);
      this.isLoading = true
      this.getAudioTime();
      this.setAudioInterval();
      audioPlayer.play();
      this.isPlay = true;
    },
    /** 暂停播放 */
    pauseAudio() {
      audioPlayer.pause();
      this.isPlay = false;
    },
    /** 滑动进度条 */
    currentTimeChange(value) {
      // 设置播放时间
      let currentTime = Number(this.audioAllDuration * Number(value) / 100)
      audioPlayer.currentTime = parseInt(currentTime);
    },
    /** 设置倍速播放 */
    changeSpeed(command) {
      audioPlayer.playbackRate = command;
      this.speed = command;
    },
    //
    changeVolume(val){
      console.log(val)
      audioPlayer.volume = val
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next(true)
      }
    },
    loop() {
      this.$refs.audioPlayer.currentTime = 0
      this.$refs.audioPlayer.playbackRate = this.speed
      this.$refs.audioPlayer.play()
    },
    next(val) {
      console.log(this.playList)
      if (this.playList.length === 1) {
        this.loop()
        return false
      }
      let index = this.currentIndex
      // 判断播放模式
      if (this.mode === playMode.random) {
        index = Math.floor(Math.random() * this.playList.length)
      } else {
        if (val) {
          index++
        } else {
          index--
        }
      }
      console.log(this.playList)
      if (index === this.playList.length) {
        index = 0
      }
      if (index < 0) {
        index = this.playList.length - 1
      }
      this.currentIndex = index
      this.playAudio()
    },
    getAudioTime() {
      let time = 0
      if (parseInt(audioPlayer.currentTime) !== Number(time)) {
        time = parseInt(audioPlayer.currentTime)

        // 获取当前播放时长
        this.audioCurrentTime = time

        // 获取音频的总时长
        this.audioAllDuration = audioPlayer.duration

        // 获取缓存时长
        const timeRanges = audioPlayer.buffered
        this.audioBuffered = timeRanges.end(timeRanges.length - 1)
        if(this.audioBuffered === 0 || this.audioBuffered > 0 && this.audioBuffered !== this.audioAllDuration && this.audioCurrentTime === this.audioBuffered) {
          this.isLoading = true
        } else {
          this.isLoading = false
        }
      }
    }
  },
  mounted() {
    audioPlayer = this.$refs.audioPlayer
  }
}
</script>

<style lang="scss" scoped>
.music-player-bottom{
  position : fixed;
  bottom : 0;
  left : 0;
  z-index: 10;
  box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.5);
}
.music-player-pc, .music-player-mobile{
  width: 100vw;
  .music-player-mask{
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    img{
      width: 150%;
      height: 150%;
      margin: -30px 0 0 -30px;
      filter: brightness(0.5) blur(10px);
    }
  }
  .music-player-panel{
    padding: 10px 0;
  }
  .music-player-panel-center{
    display: flex;
  }
}
.music-player-col{
  max-width: 1200px;
  margin: 0 auto;
}
.music-player-pc{
  color: #ffffff;
  img{
    float: left;
    width: 100%;
    height: 100%;
  }
  .music-player-next{
    width: 80px;
    height: 80px;
  }
  .music-player-play, .music-player-pause, .music-player-load{
    width: 50px;
    height: 50px;
    padding: 15px;
  }
  .music-player-head{
    width: 80px;
    height: 80px;
  }
  .music-player-info{
    padding: 0 30px;
  }
}
.music-player-mobile{

}
</style>
