import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './ChatLogics';
const SingleChat = ({ messages }) => {

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return formattedTime;
  }
  const [user, setUser] = useState({})
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')))
  }, [])


  return (
    <div className='main-content'  >
      {messages &&
        messages.map((m, i) => (
          <div className='chat-display-item' key={m.id}>
            {(isSameSender(messages, m, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (
                <img id='cursor' style={{ width: "35px", height: "35px", borderRadius: "50%" }} src={m.sender.profilePic} alt="proflie" />
              )}

            {console.log(m)}
            <span
              style={{
                backgroundColor: `${m.sender._id === user.id ? "#5C5470" : "#302942"
                  }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i, user.id) ? 3 : 10,
                borderRadius: "5px",
                padding: "5px 10px",
                userSelect: 'text',
                maxWidth: "37vw"
              }}
            >
              {
                (isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) &&
                <>
                  <span className='sender-name' >
                    ~ {m.sender.name}
                  </span>
                  <br />
                </>
              }
              <span className='sender-content' >
                {m.textMessage}
              </span>
              <br />
              <span className='sender-time' >
                {
                  `${formatTimestamp(m.createdAt)}`
                }
              </span>
            </span>
          </div>
        ))
      }
    </div >
  )
}

export default SingleChat