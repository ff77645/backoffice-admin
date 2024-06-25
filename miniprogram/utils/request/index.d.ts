
export class Request {
    constructor(opts?:object)
    get(url:string,config?:object):Promise<any>;
    delete(url:string,config?:object):Promise<any>;

    post(url:string,config?:object):Promise<any>;
    patch(url:string,config?:object):Promise<any>;
    put(url:string,config?:object):Promise<any>;
}

declare const request:Request;
// export default request;