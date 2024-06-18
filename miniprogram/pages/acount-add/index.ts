
import { areaList } from '@vant/area-data'

Page({
  data:{
    nickname:'',
    password:'',
    phone:'',
    address:'',
    area_code:'',
    avatar:'',
    email:'',
    describe:'',
    areaList,
    showArea:false,
    showUpload:true,
    fileList:[]
  },
  navBack(){
    wx.navigateBack()
  },
  selectAreaConfirm({detail}:any){
    console.log({detail});
    
  },
  selectAreaCancle(){
    this.setData({
      showArea:false
    })
  },
  openArea(){
    this.setData({showArea:true})
  },
  beforeRead({detail:{file}}:any){
    console.log({file});
    this.setData({
      fileList:[file as never]
    })
  }
})