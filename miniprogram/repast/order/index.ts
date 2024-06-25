import {debounce,throttle} from '../../utils/index'
import {
    getAllProduct,
    getAllProductCategory,
    createDraft,
    findOneDraft,
    addDraftItem,
    patchDraftItem,
    removeDraftItem,
} from '../../api/repast'


Page({
  data:{
    categoryList:[],
    groupList:[],
    group_id:'',
    active_index:0,
    checkedGoods:[],
    checkedNumber:0,
    priceSum:0,
    showCheckedGoods:false,
    aside_id:'',
    _draftBill:{},
    customer:{
      id:'19ce500c-4251-4bf0-9e25-c4700d1b508b'
    },
  },
  ratioArr:[] as any,
  isPause:false,
  goodsList:[],
  updatePageData(checkedGoods:any){
    const {categoryList} = this.data

    // 更新商品数据
    const _goodsList = this.goodsList.map((i:any)=>{
      const goods = checkedGoods.find((g:any)=>g.product_id === i.id)
      const number = goods ? goods.number : 0
      return {
        ...i,
        number
      }
    })
    const groupList:any = categoryList.map((item:any)=>{
      const children = _goodsList.filter(i=>i.category_id === item.id)
      return {
        title:item.name,
        id:item.id,
        children
      }
  })

  // 更新分类数量
  let categoryNumber:Record<string,number> = {}
  categoryList.forEach((item:any)=>{
    item.number = categoryNumber[item.id] || checkedGoods.filter(i=>i.category_id === item.id).reduce((number,i)=>{
      return number + i.number
    },0)
    categoryNumber[item.id] = item.number
  })

  // 总数 总价
  let priceSum = 0
  let checkedNumber = 0
  checkedGoods.forEach(i=>{
    priceSum += i.number * i.unit_price
    checkedNumber += i.number
  })

  this.setData({
    priceSum,
    checkedNumber,
    checkedGoods,
    groupList,
    categoryList,
  })
  },
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
      group_id:'g'+target.dataset.id
    })
    this.isPause = true
    const arr = Array.from({length:this.ratioArr.length}).fill(0)
    arr[target.dataset.index] = 1
    this.ratioArr = arr
    setTimeout(()=>{this.isPause = false},500)
  },
  updateActiveIndex(active_index:number){
    const aside_id = 'a' + this.data.categoryList[active_index].id
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
    this.changeNumber({
      detail:{
        ...target.dataset,
        value:detail,
      }
    })
  },
  privateCheckedGoods:[],
  changeNumber({detail}:{detail:{
    id:string,
    category_id:string,
    value:number
  }}){
    console.log({detail});
    const {checkedGoods} = this.data
    const goodsIndex = this.goodsList.findIndex((i:any)=>i.id === detail.id)
    const goods = this.goodsList[goodsIndex]
    goods.number = detail.value
    
    const chekcedIndex = checkedGoods.findIndex((i:any)=>i.product_id === goods.id)
    // console.log({chekcedIndex,goods});
    if(chekcedIndex === -1){
      this.pushProduct(goods)
    }else{
      if(goods.number > 0){
        (checkedGoods as any)[chekcedIndex].number = goods.number
        this.patchProduct(checkedGoods[chekcedIndex])
      }else{
        this.removeProduct(checkedGoods[chekcedIndex])
      }
    }
    // this.updatePageData(checkedGoods)
  },


  // 通过点餐单据id获取商品信息
  async fetchDraftDataForId(){
    if(!this._draftBill.id && !this.data.customer.id) return
    const data:Record<string,string> = {}
    if(this._draftBill.id){
      data.id = this._draftBill.id
    }else{
      data.customer_id = this.data.customer.id
    }
    const draftData = await findOneDraft(data)

    console.log('fetchDraftDataForId',draftData);
    if(!draftData) return
    this._draftBill = draftData
    const chekcedGoods = draftData.items
    this.updatePageData(chekcedGoods)
  },


  // 初始化分类与商品数据
  async initData(){
    const categoryRes = await getAllProductCategory()
    const productRes = await getAllProduct({page:1,limit:1000})
    this.fetchDraftDataForId()
    categoryRes.forEach(i=>{
        i.number = 0
        i.name = i.title
    })
    productRes.data.forEach(i=>{
      i.unit_price = i.retail_price
      i.number = 0
    })
    const groupList = categoryRes.map(item=>{
        return {
            title:item.name,
            id:item.id,
            children:productRes.data.filter(i=>i.category_id === item.id)
        }
    })
    this.goodsList = productRes.data
    this.setData({
        groupList,
        categoryList:categoryRes,
    })
    console.log({productRes,categoryRes});
  },

// 更新商品  
  async patchProduct(goods){
    await patchDraftItem(goods.id,goods)
    await this.fetchDraftDataDebounce()
  },

  _draftBill:{},
  fetchDraftDataTimeout:0,
  fetchDraftDataDebounce(){
    clearTimeout(this.fetchDraftDataTimeout)
    this.fetchDraftDataTimeout = setTimeout(()=>{
      this.fetchDraftDataForId()
    },300)
  },
  //   新增商品
  addingProducts:[],
  createDrafting:false,
  pushProductTime:Date.now(),
  async pushProduct(goods){
    console.log('pushProduct',goods);
    if(Date.now() - this.pushProductTime < 500) return
    this.pushProductTime = Date.now()
    if(this.createDrafting) return console.warn('正在创建 Draft');
    if(!this._draftBill.id){
      this.createDrafting = true
      const res = await createDraft({customer_id:this.data.customer.id}).finally(()=>{
        this.createDrafting = false
      })
      this._draftBill = res
    }
    const data = {
      repast_draft_id:this._draftBill.id,
      product_id:goods.id,
      title:goods.title,
      unit_price:goods.unit_price,
      number:goods.number,
      guides:goods.guides,
      remark:goods.remark,
      category_id:goods.category_id,
    }
    const hasAddingProduct = this.addingProducts.find(i=>i.product_id === data.product_id && i.guides === data.guides)
    if(hasAddingProduct) return console.warn('重复添加');
    this.addingProducts.push(data)
    console.log('pushProduct','添加商品',data);
    
    await addDraftItem(data).finally(()=>{
      this.addingProducts = this.addingProducts.filter(i=>i!==data)
      console.warn('pushProduct','移除商品',data);
    })
    await this.fetchDraftDataForId()
  },

  async removeProduct(goods){
    await removeDraftItem(goods.id)
    await this.fetchDraftDataDebounce()
  },
  onLoad(){
    this.initObserver()
    this.initData()
  },
  navBack(){
    wx.navigateBack()
  }
})