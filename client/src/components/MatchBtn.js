import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { matching, acceptMatching, cancelMatching } from '../redux/actions/profileAction'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const MatchBtn = ({ user }) => {
    const { auth, profile, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const [load, setLoad] = useState(false)
    const [loadAccept, setLoadAccept] = useState(false)
    const [loadUnmatch, setLoadUnmatch] = useState(false)


    const handleMatching = () => {
        if (load) return;
        setLoad(true)
        dispatch(matching({ users: profile.users, user, auth, socket }))
        setLoad(false)
    }

    const handleCancel = () => {
        if (loadUnmatch) return;
        setLoadUnmatch(true)
        dispatch(cancelMatching({ users: profile.users, user, auth, socket }))
        setLoadUnmatch(false)
    }

    const handleAccept = () => {
        if (loadAccept) return;
        setLoadAccept(true)
        dispatch(acceptMatching({ users: profile.users, user, auth, socket }))
        history.push('/dating')
        setLoadAccept(false)
    }


    return (
        <div>
            <div hidden={auth.user.matchStatus !== 'pending'}>
                Awaiting matching
            </div>

            {auth.user?.matchStatus === 'pending' &&
                (
                    <div className='d-flex justify-content-center mt-2' hidden={auth.user.matchStatus !== 'pending' || auth.user.matchStatus === 'pending-accept'}>
                        <button className='btn btn-danger' onClick={handleCancel}>
                            Unmatch
                        </button>
                    </div>

                )}

            <div hidden={auth.user.matchStatus !== 'pending-accept'}>
                <button className='btn btn-outline-secondary mr-2' onClick={handleCancel}>
                    Cancel
                </button>
                <button className='btn btn-outline-danger' onClick={handleAccept}>
                    Matching
                </button>
            </div>

            <button className='btn btn-outline-danger' onClick={handleMatching} hidden={auth.user.matchStatus !== 'none'}>
                Matching
            </button>
        </div>
    )
}

export default MatchBtn