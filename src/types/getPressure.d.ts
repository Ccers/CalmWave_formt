import { http } from "@/utils/http";
import type { getPressureParam,getPressureResponseParam } from "@/utils/getPressure";

export const getPressureApi=(param:getPressureParam)=>{
    return http<getPressureResponseParam>({
        url:'/get_pressure',
        method:'GET',
        data:param
    })
}