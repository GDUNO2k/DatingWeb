import { GLOBALTYPES } from '../actions/globalTypes'
import { getDataAPI } from '../../utils/fetchData'

export const SUGGEST_TYPES = {
    LOADING: 'LOADING_SUGGEST',
    GET_MATCHING_USERS: 'GET_USERS_MATCHING_SUGGEST',
}

export const getSuggestionsMatching = (token) => async (dispatch) => {
    try {
        dispatch({ type: SUGGEST_TYPES.LOADING, payload: true })
        
        const res = await getDataAPI('suggestionMatchingsUser', token)
        dispatch({ type: SUGGEST_TYPES.GET_MATCHING_USERS, payload: res.data })

        dispatch({ type: SUGGEST_TYPES.LOADING, payload: false })
        
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}