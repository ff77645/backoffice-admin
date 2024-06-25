
import CryptoJs from './crypto-js'

export class RequestCache {
  constructor(){
    this.cacheMap = {}
  }
  getRequestId(config){
    const path = config.method + config.url
    const payload = typeof config.data === 'object' ? JSON.stringify(config.data) : config.data || ''
    const hash = CryptoJs.MD5(path + payload).toString()
    return hash
  }
  addRequest(hash){
    this.cacheMap[hash] = {
      time:Date.now()
    }
  }
  removeRequest(hash){
    delete this.cacheMap[hash]
  }
  hasRequest(hash){
    return this.cacheMap[hash]
  }

}