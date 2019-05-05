import { INCREASE_PROFILE_VIEW_COUNT, GET_PROFILE_VIEW_COUNT, INCREASE_BOOKMARK_COUNT, GET_BOOKMARK_COUNT } from '../constants/action-types';
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
        case INCREASE_BOOKMARK_COUNT:
            return {
                ...state,
                payload: action.payload,
            }
        case GET_BOOKMARK_COUNT:
            return {
                ...state,
                count: action.payload
            }
        default:
            return state;
    }
}