import { 
  repastBillApi,
  findOneDraft
 } from '../../api/repast'

const categoryList = Array.from({length:10}).map((_,index)=>({
  id:`id${index}`,
  name:`类别${index}`,
  number:0,
}))

const goodsList = categoryList.map(item=>{
  return Array.from({length:Math.ceil(Math.random() * 5 + 2)}).map((_,i)=>({
    title:`${item.name}-${i}`,
    category_id:item.id,
    describe:`这是一段描述符~~~`,
    id:`${item.id}-${i}`,
    number:0,
    price:Math.ceil(Math.random() * 5000)
  }))
}).flat()

Page({
  data:{
    sumer_price:1000,
    expanded:false,
    goodsListPart1:[],
    goodsListPart2:[],
  },

  async findOneDraft(id){
    const res = await findOneDraft({id})
    const goodsListPart1 = res.items.slice(0,3)
    const goodsListPart2 = res.items.slice(3)
    this.setData({goodsListPart1,goodsListPart2})
  },
  onLoad({repast_draft_id}){
    this.findOneDraft(repast_draft_id)
  },
  navBack(){
    wx.navigateBack()
  },
  chngeExpanded(){
    this.setData({
      expanded:!this.data.expanded
    })
  }
})