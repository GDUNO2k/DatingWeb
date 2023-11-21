import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserCard from '../components/UserCard'
import MatchBtn from '../components/MatchBtn'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { getUser } from '../redux/actions/profileAction'

const Match = () => {
    const { suggestionsMatching, auth } = useSelector(state => state)
    const [matchPerson, setMatchPerson] = useState(Math.floor(Math.random() * suggestionsMatching.users.length))
    const history = useHistory();
    const dispatch = useDispatch()

    const handleNewMatch = () => {
        const newMatch = Math.floor(Math.random() * suggestionsMatching.users.length)
        if (newMatch === matchPerson) {
            handleNewMatch()
            return;
        }
        setMatchPerson(newMatch)
    }

    useEffect(() => {
        if (auth.user.matchStatus === "matched") {
            history.push('/dating')
        }
        // eslint-disable-next-line
    }, [auth.user.matchStatus])

    useEffect(() => {
        dispatch(getUser({ id: auth.user._id, auth }))
        // eslint-disable-next-line
    }, [])

    return (
        <div className='matching p-5'>
            <div className='card'>
                {auth.user.matchStatus === 'none' && [suggestionsMatching.users[matchPerson]].map((user, index) => (
                    <UserCard key={index} user={user} >
                        <MatchBtn user={user} />
                    </UserCard>))
                }

                {auth.user.matchStatus !== 'none' &&
                    <UserCard key={auth.user.matching._id} user={auth.user.matching} >
                        <MatchBtn user={auth.user.matching} />
                    </UserCard>
                }
            </div>
            <button className='btn btn-primary mt-4 w-100' onClick={handleNewMatch} hidden={auth.user.matchStatus !== 'none'}>
                New Matching
            </button>
        </div>
    )
}

export default Match
