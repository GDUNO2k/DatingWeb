import { GLOBALTYPES, DeleteData } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { createNotify, removeNotify } from '../actions/notifyAction'
import { SUGGEST_TYPES } from './suggestionsMatchingAction'


export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    MATCHING: 'MATCHING',
    ACCEPT_MATCH: 'ACCEPT_MATCH',
    UNMATCH: 'UNMATCH',
    GET_ID: 'GET_PROFILE_ID',
    GET_POSTS: 'GET_PROFILE_POSTS',
    UPDATE_POST: 'UPDATE_PROFILE_POST'
}


export const getProfileUsers = ({ id, auth }) => async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id })

    try {
        dispatch({ type: PROFILE_TYPES.LOADING, payload: true })
        const res = getDataAPI(`/user/${id}`, auth.token)
        const res1 = getDataAPI(`/user_posts/${id}`, auth.token)

        const users = await res;
        const posts = await res1;

        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: users.data
        })

        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: { ...posts.data, _id: id, page: 2 }
        })

        dispatch({ type: PROFILE_TYPES.LOADING, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }

}

export const getUser = ({ id, auth }) => async (dispatch) => {
    try {
        const res = getDataAPI(`/user/${id}`, auth.token)
        const users = await res;
        
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                ...auth,
                user: users.data?.user
            }
        })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data?.msg }
        })
    }

}

export const updateProfileUser = ({ userData, avatar, auth }) => async (dispatch) => {
    if (!userData.fullname)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Please add your full name." } })

    if (userData.fullname.length > 25)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Your full name too long." } })

    if (userData.story.length > 200)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Your story too long." } })

    try {
        let media;
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

        if (avatar) media = await imageUpload([avatar])

        const res = await patchDataAPI("user", {
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token)

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user, ...userData,
                    avatar: avatar ? media[0].url : auth.user.avatar,
                }
            }
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const follow = ({ users, user, auth, socket }) => async (dispatch) => {
    let newUser;

    if (users.every(item => item._id !== user._id)) {
        newUser = { ...user, followers: [...user.followers, auth.user] }
    } else {
        users.forEach(item => {
            if (item._id === user._id) {
                newUser = { ...item, followers: [...item.followers, auth.user] }
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
            ...auth,
            user: { ...auth.user, following: [...auth.user.following, newUser] }
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token)
        socket.emit('follow', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const unfollow = ({ users, user, auth, socket }) => async (dispatch) => {

    let newUser;

    if (users.every(item => item._id !== user._id)) {
        newUser = { ...user, followers: DeleteData(user.followers, auth.user._id) }
    } else {
        users.forEach(item => {
            if (item._id === user._id) {
                newUser = { ...item, followers: DeleteData(item.followers, auth.user._id) }
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
            ...auth,
            user: {
                ...auth.user,
                following: DeleteData(auth.user.following, newUser._id)
            }
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token)
        socket.emit('unFollow', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(removeNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const matching = ({ users, user, auth, socket }) => async (dispatch) => {
    dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
            ...auth,
            user: { ...auth.user, matching: user, matchStatus: "pending" }
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/matching`, null, auth.token)
        socket.emit('matching', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has matching you.',
            recipients: [user._id],
            url: `/match`,
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const acceptMatching = ({ users, user, auth, socket }) => async (dispatch) => {
    dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
            ...auth,
            user: { ...auth.user, matching: user, matchStatus: "matched" }
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/accept-matching`, null, auth.token)
        socket.emit('matching', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'accepted your matching.',
            recipients: [user._id],
            url: `/home`,
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const cancelMatching = ({ users, user, auth, socket }) => async (dispatch) => {
    dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
            ...auth,
            user: { ...auth.user, matching: null, matchStatus: "none" }
        }
    })

    try {
        const res = await patchDataAPI(`user/${user._id}/unmatch`, null, auth.token)
        socket.emit('matching', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has unmatched you.',
            recipients: [user._id],
            url: `/home`,
        }

        dispatch(createNotify({ msg, auth, socket }))

        const newMatchingList = await getDataAPI('suggestionMatchingsUser', auth.token)
        dispatch({ type: SUGGEST_TYPES.GET_MATCHING_USERS, payload: newMatchingList.data })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}