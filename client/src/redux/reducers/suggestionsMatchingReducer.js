import { SUGGEST_TYPES } from '../actions/suggestionsMatchingAction'

const initialState = {
    loading: false,
    users: []
}


const suggestionsReducer = (state = initialState, action) => {
    switch (action.type){
        case SUGGEST_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case SUGGEST_TYPES.GET_MATCHING_USERS:
            return {
                ...state,
                users: action.payload.users
            };
        default:
            return state;
    }
}

export default suggestionsReducer
