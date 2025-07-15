import Fuse, { IFuseOptions } from "fuse.js";


export function handleSearch<T>(list:T[],options:IFuseOptions<T>,query:string=""){
    const fuse = new Fuse(list,options);
    return fuse.search(query)
}