


Page({
  data:{
    searchVal:'',
    showMenu:false,
  },
  onSerch({detail}:any){
    console.log({detail});
  },
  navBack(){
    wx.navigateBack()
  },
  bindbuttontap({detail}:any){
    console.log({detail});
  },
  closeMenu(){
    this.setData({
      showMenu:false
    })
  },
  openMenu(){
    this.setData({
      showMenu:true
    })
  }
})