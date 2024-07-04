import {debounce,throttle} from '../../utils/index'
import {
    getAllProduct,
    getAllProductCategory,
    createDraft,
    findOneDraft,
    addDraftItem,
    patchDraftItem,
    removeDraftItem,
    repastBillApi,
} from '../../api/repast'
import {
  packageApi,
  packageCategoryApi,
} from '../../api/product'


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
  goodsListRaw:[],

 async onSubmit(){
   if(!this._draftBill.id) return
   if(!this.data.checkedGoods.length) return
  //  const repast_bill = await repastBillApi.create({
  //   repast_draft_id:this._draftBill.id
  //  })
  //  console.log({repast_bill});
   wx.navigateTo({
     url:'/repast/checkout/index?repast_draft_id='+this._draftBill.id
   })
 },

  updatePageData(checkedGoods:any){
    const {categoryList} = this.data

    // 更新商品数据
    const _goodsList = this.goodsListRaw.map((i:any)=>{
      const goods = checkedGoods.find((g:any)=>  (g.package_id || g.product_id) === i.id)
      const number = goods ? goods.number : 0 
      return {
        ...i,
        number
      }
    })
    const groupList:any = categoryList.map((item:any)=>{
      const children = _goodsList.filter(i=>i.category_id === item.id)
      return {
        title:item.title,
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
  observerCategoryTitle(){
    // category-title
    wx.createIntersectionObserver(this,{
      observeAll:true,
      thresholds:[0,.2,.4,.6,.8,1],
    })
    .relativeTo('.group-list')
    .relativeToViewport()
    .observe('.category-title',(res)=>{
      // console.log({res});
      const ratio = res.intersectionRatio
      const {title} = res.dataset
      if(ratio < 0.9) return
      console.log(title,ratio.toFixed(3));
      
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
      //   arr,max
      // });
      updateFn(active_index)
    })
  },
  changeCheckedProducts({target,detail}){
    const {index} = target.dataset
    const goods = this.data.checkedGoods[index]
    if(!goods) return 
    if(detail <= 0) return this.removeProduct(goods)
    goods.number = detail
    this.patchProduct(goods)
  },
  handleChange({detail}){
    console.log('handleChange',detail);
    if(detail.type === 'add'){
      this.pushProduct(detail.data)
    }else if(detail.type === 'change'){
      const goods = this.data.checkedGoods.find(i=>(i.package_id || i.product_id) === detail.data.id)
      if(!goods) return
      const number = detail.data.number
      if(number <= 0) return this.removeProduct(goods)
      goods.number = number
      this.patchProduct(goods)
    }
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
    if(!draftData) return this.createDraft()
    this._draftBill = draftData
    const chekcedGoods = draftData.items.sort((a,b)=>new Date(a.created_at) - new Date(b.created_at))
    this.updatePageData(chekcedGoods)
  },

  // 初始化分类与商品数据
  async initData(){
    // const categoryRes = await getAllProductCategory()
    // const productRes = await getAllProduct({page:1,limit:1000})
    // const packages = await packageApi.findAll({page:1,limit:100})
    // const packageCategory = await packageCategoryApi.findAll()

    const [
      productCategory,
      productRes,
      packageCategory,
      packages,
    ] = await Promise.all([
      getAllProductCategory(),
      getAllProduct({page:1,limit:1000}),
      packageCategoryApi.findAll(),
      packageApi.findAll({page:1,limit:100}),
    ])
    // console.log({packages,packageCategory});
    
    this.fetchDraftDataForId()

    const categoryList = [...packageCategory,...productCategory]
    categoryList.forEach(i=>{i.number = 0})
    
    packages.data.forEach(i=>{ 
      i.type = 'package'
      i.groups = JSON.parse(i.groups)
      i.isOptional = i.groups.length && i.groups.some(i=>i.total !== i.optional)
     })
    const allProducts = [...packages.data,...productRes.data]
    allProducts.forEach(i=>{
      i.unit_price = i.retail_price
      i.number = 0
    })
    const groupList = categoryList.map(item=>{
      return {
        title:item.title,
        id:item.id,
        children:allProducts.filter(i=>i.category_id === item.id)
      }
    })
    // console.log({groupList});
    
    this.goodsListRaw = allProducts
    this.setData({ 
        groupList,
        categoryList,
    },()=>{
      this.initObserver()
      this.observerCategoryTitle()
    })
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
  // 创建草稿单
  async createDraft(){
    this.createDrafting = true
    const res = await createDraft({customer_id:this.data.customer.id}).finally(()=>{
      this.createDrafting = false
    })
    this._draftBill = res
  },
  // 添加商品
  async pushProduct(goods){
    // console.log('pushProduct',goods);
    if(Date.now() - this.pushProductTime < 500) return
    this.pushProductTime = Date.now()
    if(this.createDrafting) return console.warn('正在创建 Draft');
    if(!this._draftBill.id) await this.createDraft()
    const data:any = {
      repast_draft_id:this._draftBill.id,
      title:goods.title,
      unit_price:goods.unit_price,
      number:goods.number,
      guides:goods.guides,
      remark:goods.remark,
      category_id:goods.category_id,
    }
    if(goods.type === 'package'){
      data.package_id = goods.id
      data.package_optional = goods.package_optional
    }else{
      data.product_id = goods.id
    }
    const hasAddingProduct = this.addingProducts.find(i=>i.product_id == data.package_id && i.package_id == data.product_id && i.guides === data.guides)
    if(hasAddingProduct) return console.warn('重复添加');
    this.addingProducts.push(data)
    
    await addDraftItem(data).finally(()=>{
      this.addingProducts = this.addingProducts.filter(i=>i!==data)
    })
    await this.fetchDraftDataForId()
  },

  async removeProduct(goods){
    await removeDraftItem(goods.id)
    await this.fetchDraftDataDebounce()
  },
  onLoad(){
    this.initData()
  },
  navBack(){
    wx.navigateBack()
  }
})