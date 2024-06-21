Component({
  properties:{
    data:{
      type:Object,
      value:{}
    },
  },
  data:{

  },
  methods:{
    initObserver(){
      wx.createIntersectionObserver(this).relativeTo('.goods-list').relativeToViewport().observe('.group',(res)=>{
        console.log(this.data.data.title,res);
      })
    }
  },
  lifetimes:{
    attached(){
      // this.initObserver()
    }
  }
})