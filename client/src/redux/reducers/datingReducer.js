import { DATING_TYPES } from '../actions/datingAction.js'

const initialState = {
    loading: false,
    timeline: []
}


const datingReducer = (state = initialState, action) => {
    switch (action.type){
        case DATING_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case DATING_TYPES.GET_TIMELINE:
            return {
                ...state,
                timeline: action.payload
            };
        default:
            return state;
    }
}

export default datingReducer
