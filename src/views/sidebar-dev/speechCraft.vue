<template>
  <div class="container" style="height:100%">    
    <div class="left" id="left">
      <div
        v-for="(item, index) in oneList"
        :key="index"
        :class="oneindex == item.id ? 'box back' : 'box'"
        @click="checkTabs(index)"
        :style="{lineHeight:item.name.length<=4?'40px':'20px'}"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="right">
      <div class="top" v-if="twoList.length > 0">
        <div
          class="twobox"
          v-for="(item, index) in twoList"
          :key="index"
          @click="checktwoTabs(item, index)"
        >
          {{ item.name }}
          <div v-if="twoindex == item.id" class="twobox_bot"></div>
        </div>
      </div>
      <!-- :style="twoList.length > 0 ? 'margin-top:60px' : 'margin-top:10px' " -->
      <div
        class="bottom"
        :style="{
          height: leftheight + 'px',
          marginTop: twoList.length > 0 ? '50px' : '10px'
        }"
      >
        <van-list
        style='background:#fff'
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          finished-text="没有更多数据了"
          @load="onLoad"
          :offset="10"
        >
          <div style='display:flex' v-if="posterList.length > 0">
            <div id="piclist" v-if="lista.length>0">
              <div
                class="picbox"
                v-for="(pic, i) in lista"
                :key="i"
                @click="make(pic.groupId, pic.id)"
                v-if="pic.isDisplay"
              >
                <img  width="137px" style='margin-left:-12px' :src="imageurl + pic.link" />
                <div>
                  <span class='pictext'>{{ pic.name }}</span>
                </div>
              </div>
            </div>
            <div id="piclist" v-if="listb.length>0">
              <div
                class="picbox"
                style='margin-left:0px'
                v-for="(pic, i) in listb"
                :key="i"
                @click="make(pic.groupId, pic.id)"
                v-if="pic.isDisplay"
              >
                <img  width="137px" style='margin-left:-12px' :src="imageurl + pic.link" />
                <div>
                  <span class='pictext'>{{ pic.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            style="text-align:center;padding-top:100px;height:150px;overflow:hidden"
          >
            <img
              style="width:180px"
              src="http://athena-1255600302.cosgz.myqcloud.com/attachments/null/260bb1d72a76436782119f2c688e9312.png"
            />
          </div>
        </van-list>
      </div>
    </div>
    <dia-loading :loading="isLoading"></dia-loading>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { Notify,List } from 'vant'
import DiaLoading from '../../components/common/loading'
import {ISMOBILE} from '../../config'
export default {
  components: {
    DiaLoading,
    vanList: List
  },
  data () {
    return {
      showlist:false,
      imageurl:'http://athena-1255600302.cosgz.myqcloud.com',
      height:'',
      width:'',
      oneList:[],
      twoList:[],
      oneindex:'',
      twoindex:'',
      posterList:[],
      pageNum:1,
      busy:false,
      leftheight:"736",
      authorizeUserId:'',
      loading:false,
      finished: false,
      typefirm:'',
      isLoading:true,
      jssdk: {
        // 判断是否有效值
        configValid: false,
        agentConfigValid: false,
      },
      timer:'',
      tips:'',
      lista:[],
      listb:[]
    }
  },
  mounted() {
    this.tips=setTimeout(() => {
      if (!this.$route.query.code&&!ISMOBILE&&!this.authorizeUserId){
        Notify({ type: "warning", message: "请在手机端查看" });
      }
    }, 5500);
    this.timer = setTimeout(() => {
      if (this.isLoading) {
        console.log('获取code1',this.$route.query)
        if (this.$route.query.code) {
          // 授权登录
          this.authorizeLogin(this.$route.query.code)
        }else{
          this.checkLoginStatus()
        }
        this.isLoading = false
      }
    }, 3000)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    clearTimeout(this.tips)
  },
  created(){
    // this.isLoading=false
    // this.getPosterClassify()
    if (this.$route.query.code) {
      console.log('获取code2',this.$route.query.code)
      // 授权登录
      console.log('123')
      this.authorizeLogin(this.$route.query.code)
    }else{
      console.log('234')
      this.checkLoginStatus()
    }
    this.initData()
  },
  directives: { infiniteScroll },
  methods: {
    // 判断是否登录过，登录过 返回wxuserid  能否获取userid
    checkLoginStatus() {
      this.$http.getLoginStatus().then(res => {
        this.authorizeUserId = res.data.data.wxUserId
        if(res.data.data.wxUserId){
          console.log(777)
          this.isLoading=false
          this.getPosterClassify()
          this.typefirm="trueFirm"
        }else{
          console.log(888)
          this.$router.push(`/sidebar/login`)
        }
      })
    },
    // 判断是否企业成员
    authorizeLogin(code) {
      this.$http.authorizeLogin({ code }).then(res => {
        if (res.data.code === 20000) {
          // 企业成员
          this.authorizeUserId = res.data.data.userId
          if(res.data.data.userId){
            console.log(111)
            this.isLoading=false
            this.getPosterClassify()
            this.typefirm="trueFirm"
          }else{
            console.log(222)
            this.$router.push(`/sidebar/login`)
          }
        }else if (res.data.code === 12003) {
          console.log(333)
          this.checkLoginStatus()
        }
      })
    },
    initData() {
      this.getWxJsJdkConfig()
    },
    // 通过config接口注入权限验证配置
    getWxJsJdkConfig() {
      let that = this;
      let url = that.domainAddress;
      that.$http.getWxJsJdkConfig({ url }).then((res) => {
        let config = res.data.data;
        wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式
          appId: config.appId, // 企业微信的corpID
          timestamp: config.timeStamp, // 生成签名的时间戳
          nonceStr: config.nonceString, // 生成签名的随机串
          signature: config.signature, // 签名
          jsApiList: [
            "updateTimelineShareData",
            "updateAppMessageShareData",
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareWechat"
            
          ], // 需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });
        that.jssdk.configValid = true;
        wx.ready(function() {
          // config信息验证后执行ready方法，如果在页面加载时就需要调用相关接口，则须把相关接口放在此函数中执行
          // 先从后台获取应用的id
          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: '素材海报', // 分享标题
            desc:'素材海报生成工具-小数桔',
            link: config.url+'#/sidebar/speechcraft', // 分享链接
            imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
            success: function (data) {
              layer.open({ content: '分享成功', time: 1 });
              //alert('分享成功');// 用户确认分享后执行的回调函数
            },
            cancel: function (data) {
              //alert('已取消分享');// 用户取消分享后执行的回调函数
            }
          });
          // 发送给朋友
          wx.onMenuShareAppMessage({
            title: '素材海报', // 分享标题
            desc: '素材海报生成工具-小数桔', // 分享描述
            link: config.url+'#/sidebar/speechcraft', // 分享链接
            imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function (data) {
              layer.open({ content: '分享成功', time: 1 });
              //alert('分享成功');// 用户确认分享后执行的回调函数
            },
            cancel: function (data) {
              //alert('已取消分享');// 用户取消分享后执行的回调函数
            }
          });
          // 获取“微信”按钮点击状态及自定义分享内容接口
          wx.onMenuShareWechat({
            title: '素材海报', // 分享标题
            desc: '素材海报生成工具-小数桔', // 分享描述
            link: config.url+'#/sidebar/speechcraft', // 分享链接
            imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
          });
          wx.updateTimelineShareData({ 
            title: '素材海报', // 分享标题
            link: config.url+'#/sidebar/speechcraft', // 分享链接
            imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
            success: function () {
              // 设置成功
            }
          });
          wx.updateAppMessageShareData({ 
            title: '素材海报', // 分享标题
            desc: '素材海报生成工具-小数桔', // 分享描述
            link:config.url+'#/sidebar/speechcraft', // 分享链接
            imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
            success: function () {
              // 设置成功
            }
          });
          // wx.invoke(
          //   "shareAppMessage", {
          //     title: '素材海报', // 分享标题
          //     desc: '素材海报生成工具-小数桔', // 分享描述
          //     link: config.url+'#/sidebar/speechcraft', // 分享链接
          //     imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
          //   }, function(res) {
          //       if (res.err_msg == "shareAppMessage:ok") {
          //       }
          //   }
          // );
          // wx.invoke(
          //   "shareWechatMessage", {
          //     title: '素材海报', // 分享标题
          //     desc: '素材海报生成工具-小数桔', // 分享描述
          //     link: config.url+'#/sidebar/speechcraft', // 分享链接
          //     imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
          //   }, function(res) {
          //       if (res.err_msg == "shareWechatMessage:ok") {
          //       }
          //   }
          // );
          wx.invoke("shareToExternalContact", {
            title: '素材海报', // 分享标题
            desc:'素材海报生成工具-小数桔',
            link: config.url+'#/sidebar/speechcraft', // 分享链接
            imgUrl: 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/9f88b4a8a50d4d7f86eeccbaa898649b.png', // 分享图标
            },function(res) {
                if (res.err_msg == "shareToExternalContact:ok") {
                }
            }
          );

        });
        wx.error(function(res) {
          // config信息验证失败执行相关处理
          // Notify({ type: "warning", message: "config信息验证失败" });
          that.jssdk.configValid = false;
        });
      });
    },

    // 加载更多
    onLoad(){
      this.pageNum++
      // 海报列表
      this.gainPosterList(this.twoindex?this.twoindex:this.oneindex,this.pageNum)
    },
    // 分类
    getPosterClassify(){
      this.$http.posterClassify({type:'poster'}).then(res=>{
        var list={name:'全部',id:'',childs:[]}
        this.oneList=res.data.data
        this.oneList.unshift(list)
        this.gainPosterList(this.oneList[0].id,1)
      })
    },
    // 海报列表
    gainPosterList(id,pageNum){
      this.$http.posterMatterList({type:'poster',groupId:id,pageNum}).then(res=>{
        var data=res.data.data.list
        var total=res.data.data.total
        this.loading=false
        if(res.data.data.list.length==0){
          this.finished=true
          return
        }
        data.forEach(item=>{
          this.posterList.push(item)
        })
        if(total<=this.posterList.length){
          this.finished=true
        }
        
        var strb = [],stra=[];
        for(let i=0;i<this.posterList.length;i++) {
          if(i%2==0) {
            stra.push(this.posterList[i])
          }else{
            strb.push(this.posterList[i])
          }
        }
        this.lista=stra
        this.listb=strb
        console.log(this.posterList)
      })
    },

    min(array){
      return array.indexOf(Math.min(...array))    //将传递过来的数组当中最小值的下标返回
    },
    // 切换一级分类
    checkTabs(index){
      this.twoList=this.oneList[index].childs
      this.oneindex=this.oneList[index].id
      this.twoindex=''
      this.pageNum=1
      this.posterList=[]
      // this.finished=false
      this.gainPosterList(this.oneindex,1)
      if(this.twoList.length>0){
        this.leftheight=document.getElementById('left').clientHeight-50
      }else{
        this.leftheight=document.getElementById('left').clientHeight
      }
      
    },
    // 切换二级分类
    checktwoTabs(item,i){
      // this.finished=false
      this.twoindex=this.twoList[i].id
      this.pageNum=1
      this.posterList=[]
      this.gainPosterList(this.twoindex,1)
      this.leftheight=document.getElementById('left').clientHeight-50
    },
    make(groupId,id){
      var goid=this.twoindex?this.twoindex:this.oneindex
      this.$router.push(`/sidebar/makePoster?groupId=`+goid+`&id=`+id+`&type=`+this.typefirm)
    },
    isInteger(obj) {
      return typeof obj === 'number' && obj%1 === 0
    }
    
  }
}
</script>

<style lang="less" scoped>
.pictext {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
}
#piclist {
  // display: flex;
  // flex-wrap: wrap;
  // column-gap: 1px; // 卡片间距
  // column-count: 2; // 卡片列数
  background: #fff;
  // padding: 0 13px;
  // position: relative;
  width: 50%;
  .picbox {
    // break-inside: avoid; // 不设置这个，卡片会被拦腰截断
    margin-bottom: 10px;
    border-style: outset;
    border: 1px solid #eee;
    margin-left: 15px;
    margin-bottom: 10px;
    // position: absolute;
    background: #fff;
    overflow: hidden;
    width: 125px;
    // height: 290px;
    div {
      margin-bottom: 5px;
      margin-left: 5%;
      width: 90%;
      display: flex;
      justify-content: space-between;
      span {
        // padding: 5px;
        //   padding: 2px 7px;
        //   border: 1px solid #eee;
        //   border-radius: 15px;
      }
    }
  }
}
.bottom {
  width: 100%;
  margin-top: 10px;
}
.top {
  position: fixed;
  width: 75%;
  display: flex;
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;
  padding: 10px;
  z-index: 5;
  background: #fff;
}
.twobox {
  padding: 0 5px;
  text-align: center;
}
.twobox_bot {
  display: block;
  width: 100%;
  height: 2px;
  background: #4f73ad;
  margin-top: 2px;
}
.container {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
}
.left {
  width: 22%;
  border-right: 1px solid #eee;
  position: fixed;
  height: 100%;
  background: #fff;
  overflow: auto;
}
.box {
  text-align: left;
  // overflow-y: auto;
  padding: 0px 10px;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;

  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
}
.back {
  color: #4f73ad;
  background: #eee;
}
.right {
  margin-left: 22%;
  width: 78%;
}
</style>