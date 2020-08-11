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
      <div>当前播放列表的下标：{{ currentIndex }} - {{ volumeVal }}</div>
    </div>
    <div class="music-player-pc music-player-bottom" v-if="!isMobile">
      <div class="music-player-mask">
        <!-- <img src="./assets/images/cover_audio.png" alt=""> -->
      </div>
      <div class="music-player music-player-col">
        <div class="music-player-panel music-player-panel-center">
          <div class="music-player-head">
            <img v-if="imgUrl" :src="imgUrl" alt="">
            <img v-else src="./assets/images/cover_audio.png" alt="">
          </div>
          <div class="music-player-info">
            <div class="music-player-info-top">
              <div class="music-player-info-title">
                <span>{{ title }}</span>
              </div>
              <div class="music-player-info-time no-select">
                <span>{{ audioCurrentTime | formatTime }}</span>
                <span> / </span>
                <span>{{ audioAllDuration | formatTime }}</span>
              </div>
            </div>
            <div class="music-player-info-slider">
              <div class="progress-bar-bg" v-down>
                <span :style="{'left': percentage(audioCurrentTime / audioAllDuration) + '%'}" v-drag></span>
                <div class="progress-bar" :style="{'width': percentage(audioCurrentTime / audioAllDuration) + '%'}"></div>
                <div class="progress-bar-buffered" :style="{'width': percentage(audioBuffered / audioAllDuration) + '%'}"></div>
              </div>
            </div>
          </div>
          <div class="music-player-next" @click.stop="next(false)">
            <!-- <img src="./assets/images/btn_last.png" /> -->
            <span class="icon iconSanMiAppoutlinei1-copy"></span>
          </div>
          <div>
            <div v-if="!isLoading">
              <div class="music-player-pause" @click="playPauseAudio(false)" v-if="isPlay">
                <!-- <img src="./assets/images/btn_list_pause_select.png" /> -->
                <span class="icon iconbofang"></span>
              </div>
              <div class="music-player-play" @click="playPauseAudio(true)" v-else>
                <!-- <img src="./assets/images/btn_list_play.png" /> -->
                <span class="icon iconzanting"></span>
              </div>
            </div>
            <div v-else>
              <div class="music-player-load">
                <span class="icon icon1_music80-copy"></span>
              </div>
            </div>
          </div>
          <div class="music-player-next" @click.stop="next(true)">
            <!-- <img src="./assets/images/btn_next.png" /> -->
            <span class="icon iconSanMiAppoutlinei-copy"></span>
          </div>
          <div class="music-icon">
            <span v-if="mode === 0"> <i class="icon iconliebiaoxunhuan"></i> </span>
            <span v-if="mode === 1"> <i class="icon icondanquxunhuan"></i> </span>
            <span v-if="mode === 2"> <i class="icon iconsuiji"></i> </span>
          </div>
          <div class="music-icon">
            <span class="" @click="changeVolume(1)" v-if="volumeVal !== 1">
              <i class="icon iconshengyin" title=""></i>
            </span>
            <span class="" @click="changeVolume(0)" v-else>
              <i class="icon iconjingyin" title="静音"></i>
            </span>
          </div>
          <div class="music-icon no-select">
            <span class="music-icon-speed" @click="changeSpeed(multipleArray[Math.floor(Math.random() * multipleArray.length)])">倍数：{{ speed }}</span>
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
      mode: 0,
      volumeVal: 1,
      title: '',
      imgUrl: ''
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
        if(hours > 0){
          return ('0' + hours).slice(-2) + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
        }
        return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
      } else {
        return '00:00'
      }
    },
    integerNumber(val){
      if(val >= 0){
        return Number(val.toFixed(3) * 100)
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
      let userAgentInfo = navigator.userAgent
      let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
      let flag = false
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = true
          break
        }
      }
      return flag
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
        this.getAudioTime()
        if (audioPlayer.ended) {
          this.reastData()
        }
        audioPlayer.paused ? this.isPlay = false : this.isPlay = true
      }, 500)
    },
    reastData(){
      /** 播放结束后重置数据 */
      clearInterval(this.audioInterval)
      this.$refs.audioPlayer.currentTime = 0
      this.audioCurrentTime = 0
      this.audioAllDuration = 0
      this.audioBuffered = 0
      this.isPlay = false
    },
    /** 清空外界值 */
    clearData(){
      this.playList = []
      this.currentIndex = 0
      this.reastData()
    },
    /** 设置数据 */
    setData(option){
      this.playList = option.playList || []
      this.currentIndex = option.currentIndex || 0
      if(this.playList.length === 0 || this.currentIndex < 0 || !this.playList[this.currentIndex].src) return false
      this.$refs.audioPlayer.src = this.playList[this.currentIndex].src
      this.title = this.playList[this.currentIndex].title || '暂无标题'
      this.imgUrl = this.playList[this.currentIndex].imgUrl
    },
    /** 暂停、播放 */
    playPauseAudio(val){
      if(val){
        this.playAudio()
      }else{
        this.pauseAudio()
      }
    },
    /** 播放 */
    playAudio() {
      /** 重设定时器 */
      clearInterval(this.audioInterval)
      this.isLoading = true
      this.getAudioTime()
      this.setAudioInterval()
      audioPlayer.play()
      this.isPlay = true
    },
    /** 暂停播放 */
    pauseAudio() {
      audioPlayer.pause()
      this.isPlay = false
    },
    /** 滑动进度条 */
    currentTimeChange(value) {
      // 设置播放时间
      let currentTime = Number(this.audioAllDuration * Number(value) / 100)
      audioPlayer.currentTime = parseInt(currentTime)
    },
    /** 设置倍速播放 */
    changeSpeed(command) {
      audioPlayer.playbackRate = command;
      this.speed = command
    },
    /** 设置播放音量 */
    changeVolume(val){
      console.log(val)
      audioPlayer.volume = val
      this.volumeVal = val
    },
    /** 音频播放结束后触发 */
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next(true)
      }
    },
    /** 单曲循环播放 */
    loop() {
      this.$refs.audioPlayer.currentTime = 0
      this.$refs.audioPlayer.playbackRate = this.speed
      this.$refs.audioPlayer.play()
    },
    /** 下一首 */
    next(val) {
      if (this.playList.length === 1) {
        this.loop()
        return false
      }
      let index = this.currentIndex
      /** 判断播放模式 */
      if (this.mode === playMode.random) {
        index = Math.floor(Math.random() * this.playList.length)
      } else {
        if (val) {
          index++
        } else {
          index--
        }
      }
      if (index === this.playList.length) {
        index = 0
      }
      if (index < 0) {
        index = this.playList.length - 1
      }
      this.currentIndex = index
      this.playAudio()
    },
    /** 获取音频信息 */
    getAudioTime() {
      let currentTime = 0
      if (parseInt(audioPlayer.currentTime) !== Number(currentTime)) {
        currentTime = parseInt(audioPlayer.currentTime)

        /** 获取当前播放时长 */
        this.audioCurrentTime = currentTime

        /** 获取音频的总时长 */
        this.audioAllDuration = audioPlayer.duration

        /** 获取缓存时长 */
        const timeRanges = audioPlayer.buffered
        this.audioBuffered = timeRanges.end(timeRanges.length - 1)
        if(this.audioBuffered === 0 || this.audioBuffered > 0 && this.audioBuffered !== this.audioAllDuration && this.audioCurrentTime === this.audioBuffered) {
          this.isLoading = true
        } else {
          this.isLoading = false
        }
      }
    },
    percentage(val){
      if(val >= 0){
        return Number(val.toFixed(3) * 100)
      }else{
        return 0
      }
    },
  },
  //注册局部组件指令
  directives: {
    drag: {
      bind: function(el) {
        let dragBox = el; //获取当前元素
        dragBox.onmousedown = e => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - dragBox.offsetLeft;
          // let disY = e.clientY - dragBox.offsetTop;
          document.onmousemove = e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            // let top = e.clientY - disY;

            //移动当前元素
            if(left >= 400){
              dragBox.style.left = 100 + '%';
            }else if(left <= 0){
              dragBox.style.left = 0;
            }else{
              dragBox.style.left = (left / 400).toFixed(3)*100 + '%';
              audioPlayer.currentTime = (left / 400).toFixed(3) * audioPlayer.duration
            }
          };
          document.onmouseup = e => {
            //鼠标弹起来的时候不再移动
            document.onmousemove = null;
            //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null;
          };
        };
      }
    },
    down: function(el) {
      let dragBar = el; //获取当前元素
      dragBar.onmousedown = e => {
        //算出鼠标相对元素的位置
        let disX = e.clientX - dragBar.offsetLeft;
        audioPlayer.currentTime = (disX / 400).toFixed(3) * audioPlayer.duration
        document.onmouseup = e => {
          //鼠标弹起来的时候不再移动
          document.onmousemove = null;
          //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          document.onmouseup = null;
        };
      };
    }
  },
  mounted() {
    /** 赋值 */
    audioPlayer = this.$refs.audioPlayer
  }
}
</script>

<style lang="scss" scoped>
@import './assets/icon/iconfont.css';

.no-select{
  -moz-user-select:none; /*火狐*/
  -webkit-user-select:none; /*webkit浏览器*/
  -ms-user-select:none; /*IE10*/
  -khtml-user-select:none; /*早期浏览器*/
  user-select:none;
}

.music-player-bottom{
  position : fixed;
  bottom : 0;
  left : 0;
  z-index: 10;
  box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.1);
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
    // img{
    //   width: 150%;
    //   height: 150%;
    //   margin: -30px 0 0 -30px;
    //   filter: brightness(0.5) blur(10px);
    // }
  }
  .music-player-panel{
    // padding: 10px 0;
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
  // color: #ffffff;
  img{
    float: left;
    width: 100%;
    height: 100%;
  }
  .music-player-next, .music-player-play, .music-player-pause, .music-player-load, .music-icon{
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    i{
      cursor: pointer;
    }
  }
  .music-player-play, .music-player-pause, .music-player-load{
    .icon{
      font-size: 50px;
    }
  }
  .music-player-next, .music-player-load, .music-icon{
    .icon{
      font-size: 30px;
    }
  }
  .music-icon-speed{
    cursor: pointer;
  }
  .music-player-head{
    width: 80px;
    height: 80px;
  }
  .music-player-info{
    width: 400px;
    padding-left: 30px;
    .music-player-info-top{
      display: flex;
      padding-top: 20px;
      .music-player-info-title{
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .music-player-info-time{
        min-width: 100px;
        max-width: 150px;
      }
    }
    .music-player-info-slider{
      padding-top: 10px;
      .progress-bar-bg {
        background-color: #d9d9d9;
        position: relative;
        height: 2px;
        cursor: pointer;
      }
      .progress-bar {
        background-color: #649fec;
        width: 0;
        height: 2px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        transition: 1s;
      }
      .progress-bar-buffered{
        background-color: #000000;
        width: 0;
        height: 2px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        transition: 1s;
      }
      .progress-bar-bg span {
        content: " ";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        background-color: #3e87e8;
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 3;
        margin-top: -5px;
        margin-left: -5px;
        cursor: pointer;
      }
    }
  }
}
.music-player-mobile{

}
</style>
