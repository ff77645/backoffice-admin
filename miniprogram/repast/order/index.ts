import {debounce} from '../../utils/index'
// interface Category {
//   id:string,
//   name:string
// }

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
    wx.createIntersectionObserver(this,{
      observeAll:true,
      thresholds:[0,.2,.4,.6,.8,1],
    })
    .relativeTo('.group-list')
    .relativeToViewport()
    .observe('.group-item',(res)=>{
      if(this.isPause) return
      const {
        index,
      } = res.dataset
      const rat = res.intersectionRatio

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
  onChange({target,detail}:any){
    this.chaneNum({
      detail:{
        ...target.dataset,
        value:detail,
      }
    })
  },
  chaneNum({detail}:{detail:{
    id:string,
    category_id:string,
    value:number
  }}){
    console.log({detail});
    const {goodsList,checkedGoods,categoryList} = this.data
    const groupIndex = goodsList.findIndex(i=>i.id === detail.category_id)
    const goodsIndex = goodsList[groupIndex].children.findIndex((i:any)=>i.id === detail.id)
    const goods = goodsList[groupIndex].children[goodsIndex]
    goods.number = detail.value

    // 更新已选中商品
    const chekcedIndex = checkedGoods.findIndex((i:any)=>i.id === goods.id)
    console.log({chekcedIndex,goods});
    if(chekcedIndex === -1){
      (checkedGoods as any).push(goods)
    }else{
      if(goods.number > 0){
        (checkedGoods as any)[chekcedIndex].number = goods.number
      }else{
        checkedGoods.splice(chekcedIndex,1)
      }
    }

    // 统计总数 价格
    let checkedNumber = 0
    let priceSum = 0
    checkedGoods.forEach((i:any)=>{
      checkedNumber += i.number
      priceSum += i.number * i.price
    })

    // 更新商品选中数量
    const categoryIndex = categoryList.findIndex((i:any)=>i.id === detail.category_id)
    const goodskey = `goodsList[${groupIndex}].children[${goodsIndex}].number`

    // 更新分类选中数量
    const categoryKey = `categoryList[${categoryIndex}].number`
    let categoryNumber = 0
    checkedGoods.forEach((g:any)=>{
      if(g.category_id === detail.category_id){
        categoryNumber += g.number
      }
    })

    this.setData({
      [goodskey]:detail.value,
      [categoryKey]:categoryNumber,
      checkedGoods,
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