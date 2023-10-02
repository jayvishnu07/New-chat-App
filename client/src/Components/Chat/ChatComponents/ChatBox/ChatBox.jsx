import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { GiMagicHat } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { EntireChatState } from '../../../../ContextAPI/chatContext';
import UserDetailsSidebar from '../../../UserDetailsSidebar/UserDetailsSidebar';

import './ChatBox.css';
import SingleChat from './SingleChat';

const ChatBox = () => {
  const { setSelectedChat, selectedChat, currentChat, setCurrentChat } = EntireChatState()
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('userToken')))
  const [user, setUser] = useState({})
  const [showFriendDetail, setShowFriendDetail] = useState(false)
  const [render, setRender] = useState(false)
  const [chats, setChats] = useState([])

  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  let sender;

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')))
  }, [])

  const { id, name, mail_id, profilePic, } = user;


  const getAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      let result;
      if (token) {
        result = await axios.get(`http://localhost:8080/api/get-all-chats/`, config);
        result = result.data;
      }
      if ((result.find((e) => e._id === selectedChat?._id))) {
        setCurrentChat((prev) => [...prev, selectedChat])
      }
      setCurrentChat(result)
      setRender(prev => !prev)
    } catch (error) {
      //toast
      console.log(error.message);
    }
  }

  const getSender = (users) => {
    return (users && (users[0]?._id === id ? users[1] : users[0]))
  }

  // ===========================================

  const handleSendMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "http://localhost:8080/messages",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );
      // socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  const handleNewMessage = (e) => {
    setNewMessage(e.target.value)

    //typing logics
  }


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      //   setLoading(true);

      const { data } = await axios.get(
        `http://localhost:8080/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      //   setLoading(false);

      //   socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };




  useEffect(() => {
    setCurrentChat(currentChat.filter(e => e._id !== id))
  }, [])



  useEffect(() => {
    getAllChats();
  }, [selectedChat, user])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat])


  return (
    <div className='chat-body-main-div' >
      <div className="friends-list-main-wrapper">
        <div className="friends-list-search">
          <div className="search-box-wrapper">
            <BsSearch id='search-logo' />
            <input type="text" placeholder='Search Friends...' />
          </div>
        </div>
        <div className="friends-list-div">
          {
            currentChat &&
            currentChat.map((res, key) => {
              return (
                <div key={key} id='cursor' onClick={() => setSelectedChat(res)} className={res._id === selectedChat._id ? 'friends-list-wrapper-selected' : 'friends-list-wrapper'}>
                  <div className="new-friends-list-item-wrapper-main"  >
                    <img id='cursor' src={res.isGroupChat ? res.groupProfile : getSender(res.users)?.profilePic} className='new-friends-list-profile' alt="proflie" />
                    <div className="new-friends-list-item">
                      {res.isGroupChat ? res.chatName : getSender(res.users)?.name}
                      <br />
                      {`latest message`}
                    </div>
                  </div>
                  <div className="friends-list-item-bottom-border"></div>
                </div>
              )
            })
          }

        </div>
      </div>

      {/* chat box  */}

      <div className={selectedChat._id ? "chat-and-user-detail-wrapper-main" : 'none'}>
        <div className="chat-box-main-div">
          <div className="fellow-user-details-header" id='cursor' onClick={() => { setShowFriendDetail(prev => !prev) }} >
            <div className="chat-box-feature-left">
              <img id='cursor' src={selectedChat?.users ? (selectedChat?.isGroupChat ? selectedChat?.groupProfile : getSender(selectedChat?.users)?.profilePic) : selectedChat?.profilePic} className='opposite-user-profile-in-top-bar' alt="proflie" />
              {selectedChat?.users ? (!selectedChat?.isGroupChat ? getSender(selectedChat?.users)?.name : selectedChat?.chatName) : selectedChat?.name}
            </div>
          </div>
          <div className="main-chat-box">

            <SingleChat messages={messages} />

          </div>
          <div className="chat-box-input-wrapper">
            <div className="chat-box-input-box">
              <input type="text" onChange={handleNewMessage} value={newMessage} placeholder='Type your message here . . .' />
              <div className="send-logo-div" onClick={handleSendMessage} >
                send
                <AiOutlineSend size={30} fill='#fff' />
              </div>
            </div>
            <div className="chat-box-input-bottom-border"></div>
          </div>
        </div>
        {showFriendDetail && <UserDetailsSidebar user chatInfo={selectedChat.users ? (!selectedChat.isGroupChat) ? getSender(selectedChat.users) : selectedChat : selectedChat} setShowFriendDetail={setShowFriendDetail} />}
      </div>
      <div className={!selectedChat._id ? 'no-chat-notify' : 'none'} >
        <GiMagicHat size={50} />
        <h4>Select any chat to message . . . !</h4>
        <span>In the past, before phones and the Internet, all communication was face-to-face. Now, most of it is digital, via emails and messaging services. If people were to start using virtual reality, it would almost come full circle.</span>
      </div>
    </div>
  )
}

export default ChatBox