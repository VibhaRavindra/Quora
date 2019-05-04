import  { INCREASE_PROFILE_VIEW_COUNT, GET_PROFILE_VIEW_COUNT } from '../constants/action-types';
import { access } from 'fs';

const initialState = {
}

export default function (state = initialState, action) {
    switch (action.type) {
        case INCREASE_PROFILE_VIEW_COUNT:
            return {
                ...state,
                payload: action.payload,
            }
        case GET_PROFILE_VIEW_COUNT:
            return {
                ...state,
                views: action.payload
            }
        default:
            return state;
    }
}