export interface registerParma {
    account: string,
    password: string
}
export interface registerResponseParam {
    status:string,
    token:string,
    user_info:UserInfo
}
export interface UserInfo {
    account: string,
    password: string
}