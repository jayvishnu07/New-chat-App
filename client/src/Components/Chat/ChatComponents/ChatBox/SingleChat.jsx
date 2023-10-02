import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './ChatLogics';
const SingleChat = ({ messages }) => {
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
                <img id='cursor' style={{ width: "35px", height: "35px", borderRadius: "50%", marginRight: "5px" }} src={m.sender.profilePic} alt="proflie" />
              )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user.id ? "#30294294" : "#302942"
                  }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i, user.id) ? 3 : 10,
                borderRadius: "5px",
                padding: "5px 15px",
                maxWidth: "75%",
                color: "#fff",
              }}
            >
              {m.textMessage}
            </span>
          </div>
        ))
      }
    </div >
  )
}

export default SingleChat