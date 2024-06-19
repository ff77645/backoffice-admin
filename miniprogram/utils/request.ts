

export function request(opts:any){
  return new Promise((resolve,reject)=>{
    const options:any = {
      header:{},
    }
    Object.assign(options,{
      success:resolve,
      fail:reject
    },opts)
    wx.request(options)
  })
}

;['post','patch','put'].forEach(method=>{
  (request as any)[method] = function(url:string,data:any){
    return request({url,data})
  }
})

;['get','delete'].forEach(method=>{
  (request as any)[method] = function(url:string,data:{params:any}={params:undefined}){
    return request({url,data:data.params})
  }
})
