<template>
  <div :style="{ height: height + 'px' }">
    <div class="content" id="content" style="display:block">
      <div id="imageWrapper" style="width:330px !important;">
        <!-- <van-image
          width="330"
          mode="widthFix"
          :src="poster"
          @click="showUpDate = false"
        ></van-image> -->
        <img
          style="display:block"
          width="330"
          mode="widthFix"
          :src="poster"
          @click="showUpDate = false"
        />
        <div
          v-for="(item, i) in posterDetail.posterSubs"
          :key="i"
          v-if="item.mark == 'clientName'"
          :style="item.style"
          class="habs"
        >
          <input
            v-model="item.content"
            class="noinput blink"
            :style="{fontSize: item.style.fontSize,width:item.style.width}"
          />
        </div>
        <div
          v-for="(item, i) in posterDetail.posterSubs"
          :key="i"
          v-if="item.mark == 'memberName'"
          :style="item.style"
          class="habs"
        >
          <input
            v-model="item.content"
            class="noinput blink"
            :style="{fontSize: item.style.fontSize,width:item.style.width}"
          />
        </div>
        <div
          class="habs"
          v-for="(item, i) in posterDetail.posterSubs"
          :key="i"
          v-if="item.mark == 'code'"
          :style="item.style"
        >
          <van-image
          v-if='qrcode'
            :src="qrcode"
            class='blink'
            style="padding:5px;width: calc(100% - 10px);height: calc(100% - 10px);"
            @click="showUpDate = !showUpDate"
          ></van-image>
          <div 
            v-if="showUpDate&&top>20"
            @click="updatamodel = true"
            class="picup"
          >
            点击修改
          </div>
          <div 
            v-if="showUpDate&&top<=20"
            @click="updatamodel = true"
            class="picup1"
          >
            点击修改
          </div>
        </div>
      </div>
    </div>
    <div class="picbox" v-if="hidshow">
      <div v-for="(pic, index) in bottomPhoto" style="margin-right:10px;">
        <van-image
          width="60px"
          height="95"
          :class="posterDetail.imageUrl == pic.imageUrl ? 'surn' : ''"
          :src="pic.imageUrl"
          @click="onChange(pic.id)"
        ></van-image>
      </div>
    </div>
    <div class="btn" v-if="hidshow">
      <div class="btnicon" @click="clickGeneratePic">制作完成，保存图片</div>
    </div>
    <div v-if="showmodel" class="modelcon">
      <div
        @click="showmodel = false"
        style="width:100%;height:100%;position:fixed;top:0;left:0,z-index:8;background:#000;opacity:0.7"
      ></div>
      <div
        id="modelId"
        style="width:100%;top:30px;height:80%;overflow:auto;text-align:center;position:absolute;"
      >
        <span class="tips">长按图片保存到相册</span>
        <span class="delmodel" @click="showmodel = false">x</span>
      </div>
    </div>
    <!-- 选择自定义或活码 -->
    <div v-if="updatamodel" class="modelcon">
      <div
        @click="
          updatamodel = false;
          showUpDate = false;
        "
        style="width:100%;height:100%;position:fixed;top:0;left:0,z-index:8;background:#000;opacity:0.7"
      ></div>
      <div class="updatecontent">
        <div @click="myCode" class="mycode" v-if="userInfo.qrCode">
          我的二维码
        </div>
        <div @click="showditch=true,updatamodel=false" class="mycode" v-if="userInfo.qrCode">
          渠道活码
        </div>
        <van-uploader
          accept="image/*"
          :after-read="afterRead"
          multiple
          :max-count="1">
          <div :style="{color: '#000',paddingTop:'13px',paddingBottom:'13px',width:docwidth-30+ 'px'}">自定义二维码</div>
        </van-uploader>
      </div>
    </div>


    <!-- 活码弹窗 -->
    <div v-if="showditch" class="modelcon">
      <div @click="showditch=false,showUpDate=false"
        style="width:100%;height:100%;position:fixed;top:0;left:0,z-index:8;background:#000;opacity:0.7"
      ></div>
      <div class="ditbox">
        <div v-if="ditchcode.length>0" v-for="(pic, index) in ditchcode" @click="changeDichCode(pic.qrcodeUrl)" class='ditdiv'>
          <van-image
            width="60px"
            height="60px"
            :src="pic.qrcodeUrl"
          ></van-image>
          <div style='margin-left:10px;width:210px'>
            <div style='display:flex'>
              <div style='width:50px'>名称：</div>
              <div style="width:150px">{{pic.name}}</div>
            </div>
            <div style='display:flex'>
              <div style='width:50px'>成员：</div>
              <div style="width:150px">
                <span v-for="(dec,i) in pic.userList" :key='i'><span v-if="pic.userList.length>1">{{dec.userName}}/</span><span v-if="pic.userList.length==1">{{dec.userName}}</span></span>
              </div>
            </div>
          </div>
        </div>
        <div v-else style='width:100%;text-align:center;margin-top:50px'>暂无数据</div>
      </div>
    </div>
    <dia-loading :loading="isLoading"></dia-loading>
  </div>
</template>

<script>
import html2canvas from "html2canvas"
import DiaLoading from '../../components/common/loading'
export default {
  components:{
    DiaLoading
  },
  data () {
    return {
      showditch:false,
      updatamodel:false,
      isLoading:true,
      bottomPhoto:[],
      poster:'',
      qrcode:'',
      showUpDate:false,
      posterDetail:{},
      showmodel:false,
      docwidth:document.body.clientWidth,
      height:document.documentElement.clientHeight,
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.body.clientHeight,  //实时屏幕高度
      hidshow:true,  //显示或者隐藏footer,
      isResize:false, //默认屏幕高度是否已获取,
      userInfo:{},
      top:'',
      ditchcode:[],
      timer:'',
      colors:['white','black']
    }
  },
  watch: {
    showHeight:function() {
      console.log(this.docmHeight , this.showHeight)
      if(this.docmHeight > this.showHeight){
        this.hidshow=false
      }else{
        this.hidshow=true
      }
    }
  },  
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  mounted() {
    window.onresize = ()=>{
      return(()=>{
        if (!this.isResize) {
          //默认屏幕高度
          this.docmHeight=document.documentElement.clientHeight 
          this.isResize = true
        }
        //实时屏幕高度
        this.showHeight = document.body.clientHeight 
      })()
    }
  },
  created() {
    // if (this.$route.query.groupId) {
      var groupId = this.$route.query.groupId
      this.gainPosterList(groupId)
      this.gethCode()
      if(this.$route.query.type=="trueFirm"){
        this.getmembership(this.$route.query.id)
      }else{
        this.posterRefer(this.$route.query.id)
      }
    // }
  },
  methods: {
    // 获取成员信息
    getmembership(id){
      this.$http.getUserInfo().then(res=>{
        if(res.data.data){
          this.userInfo=res.data.data
          this.posterRefer(id)
        }else{
          this.posterRefer(id)
        }
      })
    },
    // 自定义二维码
    myCode(){
      this.qrcode='data:image/jpeg;base64,'+this.userInfo.qrCode
      this.updatamodel=false
      this.showUpDate=false
    },
    // 渠道活码
    gethCode(){
      this.$http.qudaoHcode().then(res=>{
        this.ditchcode=res.data.data.list
      })
    },
    changeDichCode(code){
      this.imgToBase64(code,2)
      this.showditch=false
      this.showUpDate=false
    },
    // 图片转base64--有跨域问题
    imageUrlToBase64(url,num) {
			//一定要设置为let，不然图片不显示
			let image = new Image();
			//解决跨域问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.crossOrigin = '';
			image.src = url
			let that = this;
      //image.onload为异步加载
			image.onload = () => {
				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0, image.width, image.height);
				var quality = 0.8;
				//这里的dataurl就是base64类型
        var dataURL = canvas.toDataURL("image/jpeg", quality);//使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
        if(num==1){
          that.poster=dataURL
          this.isLoading==false
        }else if(num==2){
          this.isLoading=false
          that.qrcode=dataURL
        }
      }
    },
    // 图片转base64--接口转
    imgToBase64(img,num){
      this.$http.imgToBase64({img}).then(res=>{
        if(num==1){
          this.poster='data:image/jpeg;base64,'+res.data.message
        }else if(num==2){
          this.qrcode='data:image/jpeg;base64,'+res.data.message
        }
      })
    },
    // 修改二维码
    afterRead(file,detail){
      this.qrcode=file.content
      this.updatamodel=false
      this.showUpDate=false
    },
    // 详情
    posterRefer(id){
      this.$http.posterMatterDetail({id:id}).then(res=>{
        this.posterDetail=res.data.data
        this.poster=res.data.data.imageUrl
        this.imgToBase64(res.data.data.imageUrl,1)
        this.posterDetail.posterSubs.forEach(val => {
          if(val.type=='text'){
            if(val.mark=='memberName'){
              if(this.userInfo.name){
                val.content=this.userInfo.name
              }
            }
          }else if(val.type=='img'){
            this.top=val.style.top.substring(0,val.style.top.length-2)
            if(this.userInfo.qrCode){
              this.qrcode='data:image/jpeg;base64,'+this.userInfo.qrCode
            }else{
              this.imgToBase64('http://athena-1255600302.cosgz.myqcloud.com/attachments/null/d8ba2e2ab95c4050ab67e19bd4ecba83.jpg',2)
            }
          }
        });
        this.isLoading=false
      })
    },
    // 海报列表
    gainPosterList(id){
      this.$http.posterMatterList({type:'poster',groupId:id}).then(res=>{
        this.bottomPhoto=res.data.data.list
      })
    },
    // 切换图片
    onChange(id){
      this.showUpDate=false
      this.isLoading=true
      setTimeout(() => {
        this.posterRefer(id)
      }, 1000);
    },
    // 保存海报
    clickGeneratePic(){
      var that=this
      this.showmodel=true
      this.showUpDate=false
      this.isLoading=true
      var targetDom=document.getElementById("imageWrapper")
      var opts={scale:2,dpi:300,allowTaint:true,taintTest: true ,letterRendering:true}
      html2canvas(targetDom,opts).then(canvas => {
        let saveUrl = canvas.toDataURL('image/png')
        let oImg = document.createElement('img');
        oImg.id = 'oImg';
        oImg.className = 'o-img';
        oImg.src= saveUrl;//imgUrl是html2canvas返回的截图的base64码
        // oImg.style.position='absolute'
        // oImg.style.left='0px'
        // oImg.style.top='50px'
        // oImg.style.marginTop='30px'
        oImg.style.width='85%'
        var modelId=document.getElementById("modelId")
        this.isLoading=false
        modelId.appendChild(oImg);//将生成的截图放到页面中

        // var image=new Image()
        // image.src=saveUrl
        // image.setAttribute("crossOrigin", "anonymous");
        // image.onload = function() {
        //   let aLink = document.createElement('a')
        //   let blob = that.base64ToBlob(image.src)
        //   let evt = document.createEvent('HTMLEvents')
        //   evt.initEvent('click', true, true)
        //   aLink.download = '海报.jpg'
        //   aLink.href = URL.createObjectURL(blob)
        //   aLink.click()
        // };
      });
    },

    //这里把图片转base64
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {type: contentType})
   },
  }
}
</script>

<style lang="less" scoped>
.blink {
  font-size: 50px;
  text-shadow: 3px 3pxblack;
  overflow: hidden;
  letter-spacing: 0.15em;
  animation: typing 3.5s steps(60, end), blink-caret 0.65s step-end infinite;
  animation-iteration-count: 2;
  white-space: nowrap;
  border: 1px dashed transparent;
  // width: 500px;
}
@keyframes blink-caret {
  0% {
    border-color: transparent;
  }
  50% {
    border-color: red;
  }
  100% {
    border-color: transparent;
  }
}
// .van-uploader__input-wrapper {
// position:relative
//   width: 100% !important;
// }
// button {
//   border: none;
//   padding: 0;
//   margin: 0;
//   background: #fff;
//   line-height: 0;
// }
.van-button {
  width: 320px;
  height: 0px;
  background: #fff;
  border: none;
}
.updatecontent {
  width: 100%;
  bottom: 0px;
  overflow: auto;
  text-align: center;
  position: absolute;
  background: #fff;
  color: #000;
  .mycode {
    padding: 13px 0;
    border-bottom: 1px solid #eee;
  }
}
.modelcon {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 888;
}
.tips {
  position: fixed;
  bottom: 10%;
  color: #fff;
  text-align: center;
  width: 100%;
  left: 0;
  font-size: 16px;
}
.delmodel {
  position: fixed;
  bottom: 5%;
  color: #fff;
  text-align: center;
  width: 100%;
  left: 0;
  font-size: 16px;
}
.habs {
  position: absolute;
  // padding: 5px;
}
.noinput {
  background: transparent;
  border: 1px dashed transparent;
  font-size: 12px;
  display: block;
  // width: 125px;
}
.noinput:hover {
  border: 1px dashed #000;
}
.qrpos {
  position: absolute;
}

.picup {
  width: 90%;
  text-align: center;
  position: absolute;
  top: -40px;
  color: #fff;
  border: none;
  font-size: 12px;
  background: #000;
  border-radius: 20px;
  opacity: 0.8;
  padding: 10px 0px;
}
.picup1 {
  width: 90%;
  text-align: center;
  position: absolute;
  bottom: -40px;
  color: #fff;
  border: none;
  font-size: 12px;
  background: #000;
  border-radius: 20px;
  opacity: 0.8;
  padding: 10px 0px;
}
#imageWrapper {
  // width: 330px;
  // height: 450px;
  // overflow-y: auto;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  margin: 0 auto;
  margin-top: 15px;
}
.surn {
  opacity: 0.4;
}
.picbox {
  position: fixed;
  bottom: 60px;
  width: 96%;
  margin-left: 2%;
  display: flex;
  overflow-x: auto;
  background: #fff;
}
.ditbox {
  overflow-y: auto;
  position: fixed;
  top: 60px;
  width: 80%;
  height: 70%;
  margin-left: 10%;
  // display: flex;
  // overflow-x: auto;
  background: #fff;
  .ditdiv {
    margin: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    padding-bottom: 10px;
  }
}
.btn {
  position: fixed;
  bottom: 10px;
  width: 80%;
  left: 10%;
  .btnicon {
    text-align: center;
    width: 100%;
    background: rgb(79, 115, 173);
    color: #fff;
    border-radius: 30px;
    padding: 10px 0;
  }
}
.content {
  height: 70%;
  text-align: center;
  // margin-top: 30px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  // z-index: 888;
}
</style>