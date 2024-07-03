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
    onChange({detail,target}:any){
      const {isoptional,type,id} = target.dataset
      console.log({isoptional,type,id});
      if(isoptional){
        if(type === 'package') {
          wx.navigateTo({
            url:'/repast/package-optional/index?id='+id
          })
        }else{

        }
      }else{
        this.triggerEvent('change-num',{
          id:target.dataset.id,
          category_id:this.data.data.id,
          index:target.dataset.index,
          value:detail,
        })
      }
    },
    onAdd({target}:any){
      const {isoptional,type,id} = target.dataset
      console.log({isoptional,type,id});
      
      if(isoptional){
        if(type === 'package') {
          wx.navigateTo({
            url:'/repast/package-optional/index?id='+id
          })
        }else{

        }
      }else{
        this.triggerEvent('change-num',{
          id:target.dataset.id,
          category_id:this.data.data.id,
          index:target.dataset.index,
          value:1,
        })
      }
    }
  },
  lifetimes:{
    attached(){
    }
  }
})