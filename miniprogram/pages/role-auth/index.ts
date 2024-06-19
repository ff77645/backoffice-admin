


Page({
  data:{
    mainActiveIndex: 0,
    activeId: [],
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

  },
  onClickNav({ detail }:any) {
    console.log('onClickNav',detail);
    const _data:any = {
      mainActiveIndex: detail.index || 0,
    }
    this.setData(_data)
  },

  onClickItem({ detail }:any) {
    const { activeId } = this.data;
    const id = detail.id
    const index = activeId.indexOf(id as never);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(id as never);
    }
    this.setData({ activeId });
  },
  navBack(){
    wx.navigateBack()
  }
})