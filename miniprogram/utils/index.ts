export const debounce = (fn:Function,interval:number)=>{
  let time = Date.now()
  let timeout:number;
  return (...args:any[])=>{
    if(Date.now() - time < interval) clearTimeout(timeout)
    time = Date.now()
    timeout = setTimeout(()=>{
      fn(...args)
    },interval)
  }
}