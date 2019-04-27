import  { ADD_QUESTION, GET_ALL_QUESTIONS } from '../constants/action-types';

const initialState = {
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_QUESTION:
            return {
                ...state,
                payload: action.payload,
            }
        case GET_ALL_QUESTIONS:
            return {
                ...state,
                payload: action.payload,
            }
        default:
            return state;
    }
}