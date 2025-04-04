import { http } from "./http";
import type { AskParam,AskResponseParam } from "@/types/ai-ask";
export const ai_askAPI=(param:AskParam)=>{
    return http<AskResponseParam>({
        url:'/api/ask-ai',
        method:'POST',
        data:param
    })
}