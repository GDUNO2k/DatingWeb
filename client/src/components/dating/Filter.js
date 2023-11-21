import { useState } from "react"

const filterList = [
  { name: 'All', value: 'all', index: 0, color: '' },
  { name: 'Valid Time', value: 'valid', index: 1, color: 'rgb(134 239 172)' },
  { name: 'Busy Time', value: 'busy', index: 2, color: 'rgb(252 165 165)' },
  { name: 'Deal Time', value: 'deal', index: 3, color: 'rgb(103 232 249)' },
  { name: 'Cancel Time', value: 'cancel', index: 4, color: 'rgb(253 186 116)' },
  { name: 'Finish Time', value: 'finish', index: 5, color: 'rgb(196 181 253)' },

]
const Filter = (props) => {
  const { onChangeTimelineStatus } = props
  const [active, setActive] = useState(0)

  const onChangeActive = (num) => {
    setActive(num)
    onChangeTimelineStatus(filterList[num].value)
  }

  return <div>
    <ul className="list-group">
      {filterList.map((item, index) => {
        return <li key={index} className={`list-group-item ${active === index ? "active" : ""}`} onClick={() => {
          onChangeActive(item.index)
        }}>
          {item.name}
          <span className="color-circle" style={{ background: item.color }}></span>
        </li>
      })}
    </ul>

  </div>
}

export default Filter