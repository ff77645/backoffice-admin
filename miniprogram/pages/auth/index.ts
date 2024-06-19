


Page({
  data:{
    mainActiveIndex: 0,
    activeId: null,
    items:[
      {
        // 导航名称
        text: '浙江',
        id:'0',
        children: [
          {
            text: '温州',
            id: 1,
          },
          {
            text: '杭州',
            id: 2,
          },
        ],
      },
      {
        // 导航名称
        text: '四川',
        id:'00',
        children: [
          {
            text: '成都',
            id: 3,
          },
          {
            text: '绵阳',
            id: 4,
          },
        ],
      },

    ],

    // 添加权限
    isAddAuth:false,
    topAuth:null,
    showAddAuthDialog:false,
    authName:'',
    authCode:'',
  },
  addAuth(){
    this.setData({
      activeId:null,
      isAddAuth:true
    })
  },
  addAuthCancle(){
    this.setData({
      isAddAuth:false,
      topAuth:null
    })
  },
  addAuthConfirm(){
    this.setData({
      isAddAuth:false,
      showAddAuthDialog:true,
    })
  },
  closeAuthDialog(){
    this.setData({
      showAddAuthDialog:false,
      authName:'',
      authCode:'',
      topAuth:null,
    })
  },
  confirmAuthDialog(){
    const _data:any = {
      showAddAuthDialog:false,
      authName:'',
      authCode:'',
      topAuth:null,
    }
    // reset
    this.setData(_data)
  },
  onClickNav({ detail }:any) {
    console.log('onClickNav',detail);
    const _data:any = {
      mainActiveIndex: detail.index || 0,
    }
    if(this.data.isAddAuth){
      const auth:any = this.data.items[detail.index]
      _data.topAuth = auth
    }
    this.setData(_data)
  },

  onClickItem({ detail }:any) {
    console.log('onClickItem',{detail});

    const _data:any = {activeId:detail.id}
    if(this.data.isAddAuth){
      _data.topAuth = detail
    }
    this.setData(_data)
  },
  navBack(){
    wx.navigateBack()
  }
})