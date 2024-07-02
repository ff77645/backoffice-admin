import {request} from '../utils/request/index'

export const getAllProduct = (params:any)=>{
    return request.get('/product/info',{params})
}

export const getAllProductCategory = ()=>{
    return request.get('/product/category')
}
// 创建点餐单据
export const createDraft = (data)=>{
    return request.post('/repast/draft',data)
}
// 查询点餐单据
export const findOneDraft = params =>{
    return request.get('/repast/draft',{params})
}
// 添加商品
export const addDraftItem = (data)=>{
    return request.post(`/repast/draft/item`,data)
}
// 更新商品
export const patchDraftItem = (id,data)=>{
    return request.patch(`/repast/draft/item/${id}`,data)
}
// 删除商品
export const removeDraftItem = (id)=>{
    return request.delete(`/repast/draft/item/${id}`)
}

