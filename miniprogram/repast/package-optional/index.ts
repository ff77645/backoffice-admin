// miniprogram/repast/package-optional/index.ts
import {
  packageApi,
} from '../../api/product'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    groupList:[],
    packageInfo:{},
    headImages:[
      {src:'http://pic.yupoo.com/isfy666/ca92284b/96330991.jpeg',},
      {src:'http://pic.yupoo.com/isfy666/d4964974/4a3260c0.jpeg',},
      {src:'http://pic.yupoo.com/isfy666/b7c9c6c4/bc4d4fcf.jpeg'},
    ]
  },

  async initData(id){
    const res = await packageApi.findOne(id)
    const {products,groups:res_groups,...packageInfo} = res
    const groups = JSON.parse(res_groups)
    const goodsList = products.filter(i=>!i.group_id)
    const groupList = groups.map(group=>{
      const children = products.filter(i=>i.group_id === group.id)
      const checkedId = []
      children.forEach((item,index)=>{
        if(index < group.optional){
          item.checked = true
          checkedId.push(item.id)
        }else{
          item.checked = false
        }
      })
      this.groupCheckedMap[group.id] = checkedId
      return {
        ...group,
        children
      }
    })
    this.setData({
      goodsList,
      groupList,
      packageInfo,
    })
    console.log({res});
  },
  groupCheckedMap:{},
  onChange({detail,target}){
    console.log({detail});
    const {groupList} = this.data
    const {groupId,id} = target.dataset
    const checkedIds = this.groupCheckedMap[groupId] || (this.groupCheckedMap[groupId] = [])
    if(detail) {
      const optional = groupList.find(i=>i.id === groupId).optional
      if(checkedIds.length >= optional) checkedIds.pop()
      checkedIds.push(id)
    }else{
      this.groupCheckedMap[groupId] = checkedIds.filter(val=>val!==id)
    }
    this.updateGroupCheckedStatus()
  },
  updateGroupCheckedStatus(){
    const {groupList} = this.data
    groupList.forEach(group=>{
      group.children.forEach(item=>{
        item.checked = (this.groupCheckedMap[group.id] || []).includes(item.id)
      })
    })
    this.setData({
      groupList
    })
  },
  onSubmit(){
    console.log('onSubmit');
    console.log(this.groupCheckedMap);
    const {packageInfo} = this.data
    packageInfo.unit_price = packageInfo.retail_price
    packageInfo.package_optional = JSON.stringify(this.groupCheckedMap)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('add',packageInfo)
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({id}:any) {
    console.log({id});
    this.initData(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  navBack(){
    wx.navigateBack()
  }
})