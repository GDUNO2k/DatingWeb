import { useEffect, useState } from "react";
import Modal from 'react-modal';
import _ from 'lodash';

import formatDate from "../../utils/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { addDatingTimeline, approveCalender, cancelCalendar, updateTimeline } from "../../redux/actions/datingAction";
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '65%',
    zIndex: '3'
  },
};

const activityData = [
  { time: '00 AM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '02 AM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '04 AM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '06 AM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '08 AM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '10 AM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '12 PM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '02 PM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '04 PM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '06 PM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '08 PM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
  { time: '10 PM', activity: [{ day: 'Mon', action: '', type: '', color: '' }, { day: 'Tue', action: '', type: '', color: '' }, { day: 'Wed', action: '', type: '', color: '' }, { day: 'Thu', action: '', type: '', color: '' }, { day: 'Fri', action: '', type: '', color: '' }, { day: 'Sat', action: '', type: '', color: '' }, { day: 'Sun', action: '', type: '', color: '' }] },
]

const timeStone = [
  { value: 1, name: "00:00AM-02:00AM" },
  { value: 2, name: "02:00AM-04:00AM" },
  { value: 3, name: "04:00AM-06:00AM" },
  { value: 4, name: "06:00AM-08:00AM" },
  { value: 5, name: "08:00AM-10:00AM" },
  { value: 6, name: "10:00AM-00:00PM" },
  { value: 7, name: "00:00PM-02:00PM" },
  { value: 8, name: "02:00PM-02:00PM" },
  { value: 9, name: "04:00PM-06:00PM" },
  { value: 10, name: "06:00PM-08:00PM" },
  { value: 11, name: "08:00PM-10:00PM" },
  { value: 12, name: "10:00PM-12:00PM" }
]
const dateOfOptions = [...formatDate.listDaysFromMondayToSunday('this_week'), ...formatDate.listDaysFromMondayToSunday('next_week')]

const Calendar = (props) => {
  const { filterType } = props
  const { auth, dating, socket } = useSelector(state => state)
  const dispatch = useDispatch()
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [idEdit, setIdEdit] = useState("")
  const [load, setLoad] = useState(false)
  const [pendingList, setPendingList] = useState([])
  const [approveList, setApproveList] = useState([])
  const [isOpenModalPending, setIsOpenModalPending] = useState(false)
  const [date, setDate] = useState(formatDate.listDaysFromMondayToSunday('this_week'))
  const [dateCalender, setDateCalender] = useState('this_week')

  const onOpenModalPending = () => {
    if (!pendingList.length) return;
    setIsOpenModalPending(true)
  }

  const initFormData = {
    byUser: auth.user._id,
    status: "",
    date: '',
    time: 0,
    note: ""
  }

  const [formData, setFormData] = useState(initFormData)

  const formatColor = (status) => {
    switch (status) {
      case 'valid':
        return 'rgb(134 239 172)'
      case 'busy':
        return 'rgb(252 165 165)'
      case 'deal':
        return 'rgb(103 232 249)'
      case 'cancel':
        return 'rgb(253 186 116)'
      case 'finish':
        return 'rgb(196 181 253)'
      default:
        return ''
    }
  }

  const formatDay = (dayOfWeek) => {
    switch (dayOfWeek) {
      case 'Mon':
        return 0;
      case 'Tue':
        return 1;
      case 'Wed':
        return 2;
      case 'Thu':
        return 3;
      case 'Fri':
        return 4;
      case 'Sat':
        return 5;
      case 'Sun':
        return 6;
      default:
        return 0
    }
  }

  const getData = () => {
    const listPending = _.cloneDeep([])
    const listApprove = _.cloneDeep([])
    setApproveList([])
    let newData = _.cloneDeep(activityData)

    const todayOfLastWeek = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
    const todayOfNextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    const mondayOfLastWeek = formatDate.toString(formatDate.getFirstDateOfWeek(todayOfLastWeek))
    const sundayOfNextWeek = formatDate.toString(formatDate.getLastDateOfWeek(todayOfNextWeek))

    let mondayOfCurrentWeek, sundayOfCurrentWeek

    if (dateCalender === 'this_week') {
      mondayOfCurrentWeek = formatDate.toString(formatDate.getFirstDateOfWeek(new Date()))
      sundayOfCurrentWeek = formatDate.toString(formatDate.getLastDateOfWeek(new Date()))
    }
    if (dateCalender === 'last_week') {
      mondayOfCurrentWeek = formatDate.toString(formatDate.getFirstDateOfWeek(todayOfLastWeek))
      sundayOfCurrentWeek = formatDate.toString(formatDate.getLastDateOfWeek(todayOfLastWeek))
    }
    if (dateCalender === 'next_week') {
      mondayOfCurrentWeek = formatDate.toString(formatDate.getFirstDateOfWeek(todayOfNextWeek))
      sundayOfCurrentWeek = formatDate.toString(formatDate.getLastDateOfWeek(todayOfNextWeek))
    }

    dating.timeline.forEach(item => {
      if (new Date(mondayOfLastWeek) <= new Date(formatDate.formatDateDefault(item.date.from)) && new Date(formatDate.formatDateDefault(item.date.to)) <= new Date(sundayOfNextWeek) && item.calender[0].statusApprove === "pending") {
        listPending.push({ id: item._id, calender: item.calender })
      }
      if (new Date(mondayOfLastWeek) <= new Date(formatDate.formatDateDefault(item.date.from)) && new Date(formatDate.formatDateDefault(item.date.to)) <= new Date(sundayOfNextWeek) && item.calender[0].statusApprove === "approve") {
        listApprove.push({ id: item._id, calender: item.calender })
      }
    })

    setPendingList(listPending)

    if (filterType === 'all') {
      listApprove.forEach(item => {
        if (new Date(mondayOfCurrentWeek) <= new Date(formatDate.formatDateDefault(item.calender[0].date)) && new Date(sundayOfCurrentWeek) >= new Date(formatDate.formatDateDefault(item.calender[0].date))) {
          const dayOfWeek = formatDate.getDayNameFromDate(item.calender[0].date).substring(0, 3)
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].id = item.id
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].day = dayOfWeek
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].action = item.calender[0].note
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].type = item.calender[0].status
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].color = formatColor(item.calender[0].status)
        }
      })
      setApproveList(newData)
    } else {
      listApprove.forEach(item => {
        if (item.calender[0].status !== filterType) return;
        if (new Date(mondayOfCurrentWeek) <= new Date(formatDate.formatDateDefault(item.calender[0].date)) && new Date(sundayOfCurrentWeek) >= new Date(formatDate.formatDateDefault(item.calender[0].date))) {
          const dayOfWeek = formatDate.getDayNameFromDate(item.calender[0].date).substring(0, 3)
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].id = item.id
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].day = dayOfWeek
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].action = item.calender[0].note
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].type = item.calender[0].status
          newData[Number(item.calender[0].time - 1)].activity[formatDay(dayOfWeek)].color = formatColor(item.calender[0].status)
        }
      })
      setApproveList(newData)
    }
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line
  }, [dating.loading, filterType, dateCalender])

  const openModalCreate = () => {
    setIsOpenModalCreate(true)
  }

  const closeModal = () => {
    setIsOpenModalCreate(false);
    setIsEdit(false)
    setIdEdit('')
    setFormData({ ...initFormData })
  }

  const closeModalPending = () => {
    setIsOpenModalPending(false)
  }

  const onChangeData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addTimeline = async () => {
    if (load) return;
    setLoad(true)
    let validate = true
    Object.values(formData).forEach(item => {
      if (!item || item === "0") {
        validate = false
      }
    })

    if (!validate) {
      setLoad(false)
      window.alert("All fields are required!")
      return
    }

    const dateWeek = {
      from: date[0].stringValue,
      to: date[date.length - 1].stringValue
    }
    setFormData({ ...initFormData })
    setIsOpenModalCreate(false)
    await dispatch(addDatingTimeline({ user: auth.user, dateWeek, auth, formData, socket }))
    setLoad(false)
  }

  const approveTimeline = async (id) => {
    if (load) return;
    setLoad(true)
    setIsOpenModalCreate(false)
    setIsOpenModalPending(false)
    await dispatch(approveCalender({ user: auth.user, id, auth, socket }))
    setLoad(false)
  }

  const cancelTimeline = async (id) => {
    if (load) return;
    setLoad(true)
    if (pendingList.length === 1) setIsOpenModalPending(false)
    const item = dating.timeline.find(item => item._id === id)
    await dispatch(cancelCalendar({ user: auth.user, id, auth, socket, byUser: item.calender[0].byUser }))
    setLoad(false)
  }

  const editTimeline = async (id) => {
    // setIsOpenModalPending(false)
    setIsEdit(true)
    setIdEdit(id)
    const item = dating.timeline.find(item => item._id === id)
    const editFormData = {
      byUser: auth.user._id,
      status: item.calender[0].status,
      date: item.calender[0].date,
      time: Number(item.calender[0].time),
      note: item.calender[0].note
    }

    setFormData(editFormData)

    setIsOpenModalCreate(true)
  }

  const editModalAction = (type) => {
    if (type === 'back') {
      setIsOpenModalCreate(false)
      // setIsOpenModalPending(true)
    } else {
      submitEditTimeline(idEdit, formData)
    }
    setIsEdit(false)
    setIdEdit('')
    setFormData({ ...initFormData })
  }

  const submitEditTimeline = async (id, formData) => {
    setIsOpenModalCreate(false)
    await dispatch(updateTimeline({ user: auth.user, id, auth, socket, formData }))
    // setIsOpenModalPending(true)
    setFormData({ ...initFormData })
  }


  const nextDateCalender = () => {
    if (dateCalender === 'last_week') {
      setDate(formatDate.listDaysFromMondayToSunday('this_week'))
      setDateCalender('this_week')
    }
    if (dateCalender === 'this_week') {
      setDate(formatDate.listDaysFromMondayToSunday('next_week'))
      setDateCalender('next_week')
    }
  }

  const lastDateCalender = () => {
    if (dateCalender === 'next_week') {
      setDate(formatDate.listDaysFromMondayToSunday('this_week'))
      setDateCalender('this_week')
    }
    if (dateCalender === 'this_week') {
      setDate(formatDate.listDaysFromMondayToSunday('last_week'))
      setDateCalender('last_week')
    }
  }


  return <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex">
        <button className="btn btn-primary mr-4" onClick={openModalCreate}>Create Timeline</button>
        <button className="btn btn-outline-danger" onClick={onOpenModalPending}>
          Pending: {pendingList.length}
        </button>
      </div>


      <div className="d-flex align-items-center" style={{ margin: 0, textAlign: 'right' }}>
        <button className="btn date-action-btn" onClick={lastDateCalender} disabled={dateCalender === 'last_week'}>
          <span className="material-icons">arrow_back_ios</span>
        </button>
        <h6 style={{ marginTop: "0.5rem" }}>
          Date: {date[0].stringValue}-{date[date.length - 1].stringValue}
        </h6>
        <button className="btn date-action-btn" onClick={nextDateCalender} disabled={dateCalender === 'next_week'}>
          <span className="material-icons">arrow_forward_ios</span>
        </button>
      </div>

    </div>

    <Modal
      isOpen={isOpenModalPending}
      onRequestClose={closeModalPending}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="d-flex">
        <p className="text-center" style={{ width: '150px' }}>
          By User
        </p>
        <p className="text-center" style={{ width: '100px' }}>
          Status
        </p>
        <p className="text-center" style={{ width: '150px' }}>
          Timeline Status
        </p>
        <p className="text-center" style={{ width: '150px' }}>
          Day
        </p>
        <p className="text-center" style={{ width: '150px' }}>
          Time
        </p>
        <p className="text-center" style={{ width: '120px' }}>
          Date
        </p>
        <p className="text-center" style={{ width: '200px' }}>
          Note
        </p>
        <p className="text-center" style={{ width: '50px' }}>
        </p>
        <p className="text-center" style={{ width: '50px' }}>
        </p>
      </div>
      <div style={{ overflowY: 'auto' }}>
        {pendingList.map((item, index) => {
          return (
            <div className="d-flex" key={index} >
              <p className="text-center" style={{ width: '150px', overflowWrap: "break-word" }}>
                {item.calender[0].byUser === auth.user._id ? auth.user.username : auth.user.matching.username}
              </p>
              <p className="text-center" style={{ width: '100px' }}>
                {item.calender[0].statusApprove}
              </p>
              <div className="d-flex justify-content-center" style={{ width: '150px' }}>
                <div style={item.calender[0].status === 'valid' ? { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgb(134 239 172)' } : item.calender[0].status === 'busy' ? { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgb(252 165 165)' } : item.calender[0].status === 'deal' ? { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgb(103 232 249)' } : item.calender[0].status === 'cancel' ? { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgb(253 186 116)' } : { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgb(196 181 253)' }}>
                </div>
              </div>
              <p className="text-center" style={{ width: '150px' }}>
                {formatDate.getDayNameFromDate(item.calender[0].date)}
              </p>
              <p className="text-center" style={{ width: '150px' }}>
                {timeStone[Number(item.calender[0].time) - 1].name}
              </p>
              <p className="text-center" style={{ width: '120px' }}>
                {item.calender[0].date}
              </p>
              <p className="text-center" style={{ width: '200px' }}>
                {item.calender[0].note.substring(0, 15) + "..."}
              </p>
              <p className="text-center" style={{ width: '50px' }} >
                <span onClick={() => cancelTimeline(item.id)} className="material-icons" style={{ color: 'red', cursor: "pointer" }}>cancel</span>
              </p>
              <p className="text-center" style={{ width: '50px' }} >
                <span onClick={() => approveTimeline(item.id)} className="material-icons" style={{ color: 'green', cursor: "pointer" }} hidden={auth.user._id === item.calender[0].byUser}>check</span>
              </p>
              {/*<p className="text-center" style={{ width: '50px' }} >
                <span onClick={() => editTimeline(item.id)} className="material-icons" style={{ color: 'blue', cursor: "pointer" }} hidden={auth.user._id !== item.calender[0].byUser}>edit</span>
          </p>*/}
            </div>
          )
        })}
      </div>
    </Modal>

    <Modal
      isOpen={isOpenModalCreate}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <h1>{!isEdit ? "Create Timeline" : `Edit timeline id ${idEdit}`}</h1>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroup-sizing-default">Note</span>
        </div>
        <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" name="note" onChange={onChangeData} value={formData.note} />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputGroupSelect01">Time</label>
        </div>
        <select className="custom-select" id="inputGroupSelect04" onChange={onChangeData} name="time" value={formData.time}>
          <option value="0" >Choose...</option>
          {timeStone.map((item, index) => {
            return (
              <option value={item.value} key={index}>{item.name}</option>
            )
          })}
        </select>
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputGroupSelect01">Status</label>
        </div>
        <select className="custom-select" id="inputGroupSelect04" onChange={onChangeData} name="status" value={formData.status || ""}>
          <option value="0">Choose...</option>
          <option value="valid">Valid Time</option>
          <option value="busy">Busy Time</option>
          <option value="deal">Deal Time</option>
          <option value="cancel">Cancel Time</option>
          <option value="finish">Finish Time</option>
        </select>
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputGroupSelect01">Day of week</label>
        </div>
        <select className="custom-select" id="inputGroupSelect04" onChange={onChangeData} name="date" value={formData.date || ""} disabled={isEdit}>
          <option value="0" >Choose...</option>
          {dateOfOptions.map((item, index) => {
            return (
              <option value={item.stringValue} key={index} hidden={new Date(formatDate.formatDateDefault(item.stringValue)) < new Date(new Date().setHours(0, 0, 0, 0))}>{formatDate.getDayNameFromDate(item.stringValue)} ({item.stringValue})</option>
            )
          }
          )}
        </select>
      </div>
      <div className='d-flex justify-content-end mt-4'>
        <button className='btn btn-primary mr-3' onClick={() => editModalAction('back')} hidden={!isEdit}>
          Back
        </button>
        <button className='btn btn-success' onClick={() => editModalAction('submit')} hidden={!isEdit}>
          Update
        </button>

        <button className='btn btn-primary mr-3' onClick={closeModal} hidden={isEdit}>
          Cancel
        </button>
        <button className='btn btn-success' onClick={addTimeline} hidden={isEdit}>
          Add
        </button>
      </div>
    </Modal>

    <div className="calendar-wrapper">
      <div className="d-flex" style={{ marginBottom: '10px' }}>
        <div style={{
          width: '80px', marginRight: '10px', textAlign: 'center', fontWeight: 500,
          letterSpacing: "1px", background: '#007bff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}><span>TIME</span></div>
        {daysOfWeek.map((day, index) => {
          return <div key={index} className="days-week-wrapper" >
            <div className="days-week" >{day.slice(0, 3).toUpperCase()}</div>
          </div>
        })}
      </div>
      <div className="day-time-wrapper">{approveList.map((item, index) => {
        return <div key={index} className="d-flex align-items-stretch">
          <div className="day-time d-flex align-items-center justify-content-center" style={{ margin: '0 10px 10px 0', fontSize: '14px', textAlign: 'center' }}>{item.time}</div>
          {item.activity.map((i, idx) => {
            return <div className={`${!i.id ? "" : "cursor"}`} key={idx} onClick={() => editTimeline(i.id)} style={{ padding: '10px', background: i.color, margin: '0 10px 10px 0', width: '120px', overflowWrap: "break-word", boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px" }}>{i.action}</div>
          })}
        </div>
      })}</div>
    </div>
  </div>
}

export default Calendar