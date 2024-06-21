
interface Category {
  id:string,
  name:string
}

const categoryList = Array.from({length:10}).map((_,index)=>({
  id:`id${index}`,
  name:`类别${index}`
}))

const goodsList = categoryList.map(item=>{
  return {
    title:item.name,
    children:Array.from({length:Math.ceil(Math.random() * 5 + 2)}).map((_,i)=>({
      title:`${item.name}-${i}`,
      category_id:item.id,
      describe:`这是一段描述符~~~`
    }))
  }
})

Page({
  data:{
    categoryList,
    goodsList,
    current_id:''
  },
  selectCategory({target}:any){
    this.setData({
      current_id:target.dataset.id
    })
  },
  initObserver(){
    wx.createIntersectionObserver(this).relativeTo('.goods-list').relativeToViewport().observe('.group-item',(res)=>{
      console.log(res);
    })
  },
  onLoad(){
    this.initObserver()
  },
  navBack(){
    wx.navigateBack()
  }
})