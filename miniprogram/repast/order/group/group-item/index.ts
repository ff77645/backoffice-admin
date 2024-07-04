import { addDraftItem } from "../../../../api/repast"

// miniprogram/repast/order/group/group-item/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange({detail}:any){
      this.triggerEvent('change',{
        type:'change',
        data:{
          ...this.data.item,
          number:detail
        }
      })
    },
    onAdd(){
      const {item} = this.data
      if(item.isOptional){
        if(item.type === 'package') {
          wx.navigateTo({
            url:'/repast/package-optional/index?id='+item.id,
            events:{
              add(data){
                console.log({data});
              }
            }
          })
        }else{

        }
      }else{
        this.triggerEvent('change',{
          type:'add',
          data:{
            ...item,
            number:1
          }
        })
      }
    },
  }
})