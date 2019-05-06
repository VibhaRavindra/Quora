import  { GET_PROFILE_PIC } from '../constants/action-types';

const initialState = {
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE_PIC:
            return {
                ...state,
                payload: action.payload,
            }
        default:
            return state;
    }
}