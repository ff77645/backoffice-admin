
export class Request {
    constructor(opts?:object)
    get(url:string,config?:object):Promise<object>;
    delete(url:string,config?:object):Promise<object>;

    post(url:string,config?:object):Promise<object>;
    patch(url:string,config?:object):Promise<object>;
    put(url:string,config?:object):Promise<object>;
}

declare const request:Request;
// export default request;