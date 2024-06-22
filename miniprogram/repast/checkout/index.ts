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
})
Page({
  data:{
    sumer_price:1000,
    goodsList:goodsList.flat(),
    expanded:true,
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