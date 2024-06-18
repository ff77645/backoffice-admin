
import { areaList } from '@vant/area-data'

Page({
  data:{
    username:'',
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
    addressDetail:'',
    fileList:[]
  },
  navBack(){
    wx.navigateBack()
  },
  selectAreaConfirm({detail}:any){
    console.log({detail});
    const area_code = detail.values[2].code
    const address = detail.values.map((i:any)=>i.name).join('')
    this.setData({address,area_code,showArea:false})
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