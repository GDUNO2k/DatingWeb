import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal';

import Filter from '../components/dating/Filter'
import Calendar from '../components/dating/Calendar'
import UserCard from '../components/UserCard'
import { cancelMatching, getUser } from '../redux/actions/profileAction'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { getDatingTimeline } from '../redux/actions/datingAction';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '3'
  },
};

const Dating = () => {
  const { auth, profile, socket } = useSelector(state => state)
  const dispatch = useDispatch()
  const history = useHistory()
  const [loadUnmatch, setLoadUnmatch] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [timelineStatus, setTimelineStatus] = useState('all')

  const unmatch = async () => {
    if (loadUnmatch) return;
    history.push('/home')
    setLoadUnmatch(true)
    await dispatch(cancelMatching({ users: profile.users, user: auth.user.matching, auth, socket }))
    setLoadUnmatch(false)
  }

  const openDeleteModal = () => {
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false);
  }

  useEffect(() => {
    if (auth.user.matchStatus === "none") {
      history.push("/match")
    }
    // eslint-disable-next-line
  }, [auth.user.matchStatus])

  useEffect(() => {
    if (auth.token) {
      dispatch(getDatingTimeline({ user: auth.user._id, matchingId: auth.user.matching?._id, token: auth.token }))
    }
    // eslint-disable-next-line
  }, [auth.token])

  useEffect(() => {
    dispatch(getUser({ id: auth.user._id, auth }))
    // eslint-disable-next-line
  }, [auth.user.matchStatus])

  const onChangeTimelineStatus = (status) => {
    setTimelineStatus(status)
  }

  if (auth.user.matchStatus === "none") {
    return (
      <div>
      </div>
    )
  }

  return (
    <div className="dating">
      <div className='mb-4'>
        <div className='d-flex justify-content-center align-items-center'>
          <UserCard user={auth.user} className="dating-card" />
          <span className="material-icons" style={{ color: 'red', fontSize: '35px' }}>favorite</span>
          <UserCard user={auth.user.matching} className="dating-card" />
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-danger px-1 py-0' onClick={openDeleteModal}>
            Unmatch
          </button>
        </div>
      </div>
      <Modal
        isOpen={openModal}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <h3>Are you sure you want to unmatch {auth.user?.matching?.username} ?</h3>
        <div className='d-flex justify-content-end mt-4'>
          <button className='btn btn-primary mr-3' onClick={closeModal}>
            Cancel
          </button>
          <button className='btn btn-danger' onClick={unmatch}>
            Ok
          </button>
        </div>
      </Modal>
      <div className="row">
        <div className="col-12 col-md-2">
          <Filter onChangeTimelineStatus={onChangeTimelineStatus} />
        </div>
        <div className="col-12 col-md-10 mt-3 mt-md-0 p-1">
          <Calendar filterType={timelineStatus} />
        </div>
      </div>
    </div>
  )
}

export default Dating