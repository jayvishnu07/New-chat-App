import React from 'react';
import { EntireChatState } from '../../../../ContextAPI/chatContext';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './ChatLogics';

const SingleChat = ({ messages }) => {
  const { user } = EntireChatState();
  return (
    <div>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m.id}>
            {(isSameSender(messages, m, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (<></>
                // <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                //   <Avatar
                //     mt="7px"
                //     mr={1}
                //     size="sm"
                //     cursor="pointer"
                //     name={m.sender.name}
                //     src={m.sender.pic}
                //   />
                // </Tooltip>
              )}
            {
              console.log("true or false", m.sender._id === user.id, m.sender._id, "==", user.id)
            }
            <span
              style={{
                backgroundColor: `${m.sender._id === user.id ? "blue" : "green"
                  }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i, user.id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                color: "#000"
              }}
            >
              {m.textMessage}
            </span>
          </div>
        ))}
    </div>
  )
}

export default SingleChat