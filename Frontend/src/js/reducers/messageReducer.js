import  { GET_EMAIL_LIST, GET_MESSAGE_CONVERSATION_LIST, GET_MESSAGES } from '../constants/action-types';

const initialState = {
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_EMAIL_LIST:
            return {
                ...state,
                emailList: action.payload,
            }
        case GET_MESSAGE_CONVERSATION_LIST:
            return {
                ...state,
                conversationList: action.payload,
            }
        case GET_MESSAGES:
            return{
                ...state,
                messageList: action.payload,
            }
        default:
            return state;
    }
}