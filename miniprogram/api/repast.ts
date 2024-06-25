import {request} from '../utils/request/index'

export const getAllProduct = (params:any)=>{
    return request.get('/api/product/info',{params})
}

export const getAllProductCategory = ()=>{
    return request.get('/api/product/category')
}
// 创建点餐单据
export const createDraft = (data)=>{
    return request.post('/api/repast/draft',data)
}
// 查询点餐单据
export const findOneDraft = params =>{
    return request.get('/api/repast/draft',{params})
}
// 添加商品
export const addDraftItem = (data)=>{
    return request.post(`/api/repast/draft/item`,data)
}
// 更新商品
export const patchDraftItem = (id,data)=>{
    return request.patch(`/api/repast/draft/item/${id}`,data)
}
// 删除商品
export const removeDraftItem = (id)=>{
    return request.delete(`/api/repast/draft/item/${id}`)
}

