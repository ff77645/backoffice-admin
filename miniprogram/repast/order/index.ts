import {debounce} from '../../utils/index'
interface Category {
  id:string,
  name:string
}

const categoryList = Array.from({length:10}).map((_,index)=>({
  id:`id${index}`,
  name:`类别${index}`,
  number:0,
}))

const goodsList = categoryList.map(item=>{
  return {
    title:item.name,
    id:item.id,
    children:Array.from({length:Math.ceil(Math.random() * 5 + 2)}).map((_,i)=>({
      title:`${item.name}-${i}`,
      category_id:item.id,
      describe:`这是一段描述符~~~`,
      id:`${item.id}-${i}`,
      number:0,
      price:Math.ceil(Math.random() * 5000)
    }))
  }
})

Page({
  data:{
    categoryList,
    goodsList,
    current_id:'',
    active_index:0,
    checkedGoods:[],
    checkedNumber:0,
    priceSum:0,
    showCheckedGoods:false,
    aside_id:'',
  },
  ratioArr:[] as any,
  isPause:false,
  toggleCheckedModel(){
    const {checkedNumber,showCheckedGoods} = this.data
    if(checkedNumber === 0 && !showCheckedGoods) return
    this.setData({
      showCheckedGoods:!showCheckedGoods
    })
  },
  closeCheckedModel(){
    this.setData({
      showCheckedGoods:false
    })
  },
  openCheckedModel(){
    this.setData({
      showCheckedGoods:true
    })
  },
  selectCategory({target}:any){
    console.log(target);
    
    this.setData({
      active_index:target.dataset.index,
      current_id:target.dataset.id
    })
    this.isPause = true
    const arr = Array.from({length:this.ratioArr.length}).fill(0)
    arr[target.dataset.index] = 1
    this.ratioArr = arr
    setTimeout(()=>{this.isPause = false},500)
  },
  updateActiveIndex(active_index:number){
    const aside_id = 'aside' + this.data.categoryList[active_index].id
    this.setData({
      active_index,
      aside_id
    })
  },
  initObserver(){
    const updateFn = debounce(this.updateActiveIndex,300)
    console.log({updateFn});
    
    wx.createIntersectionObserver(this,{
      observeAll:true,
      thresholds:[0,.2,.4,.6,.8,1],
    })
    .relativeTo('.group-list')
    .relativeToViewport()
    .observe('.group-item',(res)=>{
      // console.log(res);
      if(this.isPause) return
      const {
        title,
        index,
      } = res.dataset
      const rat = res.intersectionRatio
      // console.log(title,rat);
      // if(rat < 0.1) return
      this.ratioArr[index] = rat
      const arr:any = Array.from(this.ratioArr).map(i=>i || 0).slice()
      const max = Math.max(...arr)
      const active_index = arr.indexOf(max)
      // console.log({
      //   arr,max,c_index,rat,title,index
      // });
      updateFn(active_index)
    })
  },
  chaneNum({detail}:any){
    console.log({detail});
    const {goodsList,checkedGoods,categoryList} = this.data
    const i = goodsList.findIndex(i=>i.id === detail.category_id)
    const goods = goodsList[i].children[detail.index]
    goods.number = detail.value

    // 已选中商品
    const new_checkedGoods:any = checkedGoods.filter((i:any)=>i.id !== goods.id)
    new_checkedGoods.push(goods)

    // 统计总数
    let checkedNumber = 0
    let priceSum = 0
    new_checkedGoods.forEach(i=>{
      checkedNumber += i.number
      priceSum += i.number * i.price
    })

    // 更新分类
    categoryList.forEach(i=>{
      let number = 0
      new_checkedGoods.forEach(g=>{
        if(g.category_id === i.id){
          number += g.number
        }
      })
      i.number = number
    })

    this.setData({
      goodsList,
      checkedGoods:new_checkedGoods,
      categoryList,
      checkedNumber,
      priceSum
    })
  },
  onLoad(){
    this.initObserver()
  },
  navBack(){
    wx.navigateBack()
  }
})