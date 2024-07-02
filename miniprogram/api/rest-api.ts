import {request} from '../utils/request/index'

export class RestApi {
  agent:any;
  url:string;
  constructor(url:string,agent?:any){
    this.url = url
    this.agent = agent || request
  }
  
  create(params?:object){
    return this.agent.post(this.url,params)
  }

  findAll(params?:object){
    return this.agent.get(this.url,{params})
  }

  findOne(id?:string){
    return this.agent.get(`${this.url}/${id}`)
  }
  
  update(id?:string,params?:object){
    return this.agent.patch(`${this.url}/${id}`,params)
  }

  remove(id?:string){
    return this.agent.delete(`${this.url}/${id}`)
  }

  static extend(url:string,methods:object,agent?:any){
    const instance = new RestApi(url,agent)
    Object.assign(instance,methods)
    return instance
  }
}