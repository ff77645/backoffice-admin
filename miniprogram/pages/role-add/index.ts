


Page({
  data:{
    title:'添加角色',
    role_name:'',
    role_sign:'',
    sort:100,
    describe:'',
    permission:[],
    authList:[],
  },
  editAuto(){
    wx.navigateTo({url:'/pages/role-auth/index'})
  },
  navBack(){
    wx.navigateBack()
  }
})