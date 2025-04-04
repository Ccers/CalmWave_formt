import { http } from "@/utils/http"
import type { registerParma,registerResponseParam } from "@/types/register"

export const registerApi=(param:registerParma)=>{
    return http<registerResponseParam>({
        url:'/login',
        method:'POST',
        data:param
    })
}