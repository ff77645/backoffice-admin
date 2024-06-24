

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdpZCI6Ijc5NzQ4YzM5LWEzZGUtNDM1MC04NDNkLTBmZWRjZDE2YTg5NiIsInBlcm1pc3Npb24iOiIiLCJ1aWQiOiI3OTc0OGMzOS1hM2RlLTQzNTAtODQzZC0wZmVkY2QxNmE4OTYiLCJ0eXBlIjowLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzE1NTg0MTQ5fQ.6VJ9iGVZEIOEmGf7oxlYzwP1cVLS7p_Ey6E3yoxbn40'

const baseUrl = 'http://localhost:3000'

export function request(opts){
    return new Promise((resolve,reject)=>{
        opts.url = baseUrl + opts.url
      const options = {
        header:{
            'authorization':token
        },
      }
      Object.assign(options,{
        success:res=>resolve(res.data),
        fail:reject
      },opts)
      wx.request(options)
    })
  }
  
  
  ;['post','patch','put'].forEach(method=>{
    request[method] = function(url,data){
      return request({url,data})
    }
  })
  
  ;['get','delete'].forEach(method=>{
    request[method] = function(url,data={params:undefined}){
      return request({url,data:data.params})
    }
  })
  
  