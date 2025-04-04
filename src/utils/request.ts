import { http } from "@/utils/http"
import type { AskRequest, AskResponse } from "@/types/ai-ask"

export const ask_aiRequest=(param:AskRequest)=>{
    return http<AskResponse>({
        url:'/api/ask-ai',
        method: 'POST',
        data:param
    });
};