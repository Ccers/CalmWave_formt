export interface getPressureParam {
    account: string,
    data: string
}
export interface getPressureResponseParam {
    data: pressureRecord[],
    status: string
}
export interface pressureRecord {
    account: string,
    device_id: string,
    id: number,
    pressure_value: number,
    record_time: string
}