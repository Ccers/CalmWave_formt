export interface AskRequest {
    question: string;
    user_id: string;
}

export interface AskResponse {
    answer: string;
}