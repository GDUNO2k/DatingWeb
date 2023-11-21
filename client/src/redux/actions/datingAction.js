import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData'
import { createNotify } from './notifyAction'

export const DATING_TYPES = {
    LOADING: 'LOADING_DISCOVER',
    GET_TIMELINE: 'GET_TIMELINE',
    CREATE_TIMELINE: 'CREATE_TIMELINE',
    UPDATE_TIMELINE: 'UPDATE_TIMELINE'
}

export const getDatingTimeline = (user) => async (dispatch) => {
    try {
        dispatch({ type: DATING_TYPES.LOADING, payload: true })

        const res = await getDataAPI(`dating/timeline/${user.user}?matchingId=${user.matchingId}`, user.token)

        if (res.status === 200) {
            dispatch({ type: DATING_TYPES.GET_TIMELINE, payload: res.data.dating })

            dispatch({ type: DATING_TYPES.LOADING, payload: false })
        }

    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err?.response?.data?.msg } })
    }
}

export const addDatingTimeline = ({ user, dateWeek, auth, formData, socket }) => async (dispatch) => {

    const body = {
        couple: [user._id, user.matching._id],
        date: dateWeek,
        calender: formData
    }

    try {
        await postDataAPI(`dating/create`, body, auth.token)
        socket.emit("editCalender",auth.user.matching)

        dispatch(getDatingTimeline({ user: user._id, matchingId: auth.user.matching?._id, token: auth.token }))
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const approveCalender = ({ user, id, auth, socket }) => async (dispatch) => {
    try {
        await patchDataAPI(`dating/updateStatusTimeline/${id}`, { status: 'approve' }, auth.token)
        socket.emit("editCalender",auth.user.matching)
        const msg = {
            id: auth.user._id,
            text: 'added a new timeline.',
            recipients: [auth.user.matching?._id],
            url: `/dating`,
        }

        dispatch(createNotify({ msg, auth, socket }))
        dispatch(getDatingTimeline({ user: user._id, matchingId: auth.user.matching?._id, token: auth.token }))
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const cancelCalendar = ({ user, id, auth, socket, byUser }) => async (dispatch) => {
    try {
        await patchDataAPI(`dating/updateStatusTimeline/${id}`, { status: 'cancel' }, auth.token)
        socket.emit("editCalender",auth.user.matching)
        if (auth.user._id !== byUser) {
            const msg = {
                id: auth.user._id,
                text: 'canceled a new timeline.',
                recipients: [auth.user.matching?._id],
                url: `/dating`,
            }
            dispatch(createNotify({ msg, auth, socket }))
        }

        dispatch(getDatingTimeline({ user: user._id, matchingId: auth.user.matching?._id, token: auth.token }))
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}


export const updateTimeline = ({ user, id, auth, socket, formData }) => async (dispatch) => {
    try {
        await patchDataAPI(`dating/updateTimeline/${id}`, formData, auth.token)
        socket.emit("editCalender",auth.user.matching)

        dispatch(getDatingTimeline({ user: user._id, matchingId: auth.user.matching?._id, token: auth.token }))
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}


