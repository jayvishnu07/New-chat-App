import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { StageSpinner } from 'react-spinners-kit';
import { toast } from 'react-toastify';
import io from "socket.io-client";
import { EntireChatState } from '../../../../ContextAPI/chatContext';
import UserDetailsSidebar from '../../../UserDetailsSidebar/UserDetailsSidebar';
import logo from '../.././../../assets/Group-31.svg';
import './ChatBox.css';
import SingleChat from './SingleChat';

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

const ChatBox = () => {
  const { setSelectedChat, selectedChat, currentChat, setCurrentChat, notification, setNotification, fetchAgain, setFetchAgain } = EntireChatState()
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('userToken')))
  const [user, setUser] = useState({})
  const [showFriendDetail, setShowFriendDetail] = useState(false)
  const [render, setRender] = useState(false)
  const [chats, setChats] = useState([])

  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  let sender;
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [extraScroll, setExtraScroll] = useState(0);

  const [nlpArray,setNlpArray] = useState([])
  const [selectedFromNLP,setSelectedFromNLP] = useState('')

  const messagesRef = useRef(null);
  const inputRef = useRef(null)


  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')))
  }, [])

  const { id } = user;


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
      socket.emit("new message", data);
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
  const handleNewMessage = async(e) => {
    setNewMessage(e.target.value)
    let value = e.target.value;
    let firstWord;

    const atIndex = value.indexOf('@');

    if (atIndex !== -1) {
      const remainingText = value.slice(atIndex + 1);
      firstWord = remainingText.split(' ')[0];
      console.log("firstWord ",firstWord);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        //have a look here
        const {data} = await axios.post(
          `http://localhost:8081/api/v1/suggestions?text=${firstWord}`,
          config
        );
        console.log("log from NLP ",data);
        setNlpArray(data)
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
    } else {
    }


    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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


      socket.emit("join chat", selectedChat._id);
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

  const handleSelectedChat = (res) => {
    setSelectedChat(res)
    const stringified = JSON.stringify(res)
    localStorage.setItem('selectedChat', stringified)
  }

  const changeWithRegularExpression = (obj)=>{
    setSelectedFromNLP(obj.answer)
    setNewMessage((prevMessage)=>{
      return newMessage.replace(/@(\w+)/g, obj.answer)
    })
    inputRef.current.focus();
    setNlpArray([])
  }

  useEffect(() => {
    setSelectedChat(JSON.parse(localStorage.getItem('selectedChat')))
  }, [])

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    if (messagesRef.current) {
      // Calculate the extra scroll based on the typing state
      const additionalScroll = typing ? 40 : 0;
      setExtraScroll(additionalScroll);

      // Scroll to the bottom with extra scroll
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight + additionalScroll;
      console.log("additionalScroll", additionalScroll);
    }
  }, [messages, typing]);



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
                <div key={key} id='cursor' onClick={() => handleSelectedChat(res)} className={res._id === selectedChat?._id ? 'friends-list-wrapper-selected' : 'friends-list-wrapper'}>
                  <div className="new-friends-list-item-wrapper-main"  >
                    <img id='cursor' src={res.isGroupChat ? res.groupProfile : getSender(res.users)?.profilePic} className='new-friends-list-profile' alt="proflie" />
                    <div className="new-friends-list-item">
                      <div className='name-with-notification' >
                        <span >{res.isGroupChat ? res.chatName : getSender(res.users)?.name}</span>
                      </div>
                      <div className='latest-msg-div' >{`~ : ${res?.recentMessage?.textMessage ? res?.recentMessage?.textMessage : 'No messages'}`}</div>
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

      <div className={selectedChat?._id ? "chat-and-user-detail-wrapper-main" : 'none'}>
        <div className="chat-box-main-div">
          <div className="fellow-user-details-header" id='cursor' onClick={() => { setShowFriendDetail(prev => !prev) }} >
            <div className="chat-box-feature-left">
              <img id='cursor' src={selectedChat?.users ? (selectedChat?.isGroupChat ? selectedChat?.groupProfile : getSender(selectedChat?.users)?.profilePic) : selectedChat?.profilePic} className='opposite-user-profile-in-top-bar' alt="proflie" />
              {selectedChat?.users ? (!selectedChat?.isGroupChat ? getSender(selectedChat?.users)?.name : selectedChat?.chatName) : selectedChat?.name}
            </div>
          </div>
          <hr style={{ width: "100%", color: "#fff", marginBlockStart: "0", marginBlockEnd: "0" }} />
          <div className="main-chat-box" ref={messagesRef}>
            <SingleChat messages={messages} />
            {istyping && <div className='typing-div' ><StageSpinner size={50} color="#2A2438" /></div>}
          </div>
          <div className="suggestions">
            {
              nlpArray.map((obj,key)=>{
                return(

                <div className="suggestions-item" key={key} onClick={()=>{changeWithRegularExpression(obj)}} >
                  {console.log(obj)}
                  {`${obj.answer}`}
                </div>
                )

              })
            }
          </div>

          <div className="chat-box-input-wrapper">  
            <div className="chat-box-input-box">
              <input type="text" onChange={handleNewMessage} value={newMessage} ref={inputRef} onKeyDown={(e) => { e.key == "Enter" && handleSendMessage() }} placeholder='Type your message here . . .' />
              <div className="send-logo-div" onClick={handleSendMessage} >
                send
                <AiOutlineSend size={30} fill='#fff' />
              </div>
            </div>
          </div>
        </div>
        {showFriendDetail && <UserDetailsSidebar user chatInfo={selectedChat?.users ? (!selectedChat?.isGroupChat) ? getSender(selectedChat?.users) : selectedChat : selectedChat} setShowFriendDetail={setShowFriendDetail} />}
      </div>
      <div className={!selectedChat?._id ? 'no-chat-notify' : 'none'} >
        <img src={logo} id='cursor' alt="Logo" width={"120px"} />
        <h4>Select any chat to message . . . !</h4>
        <span>In the past, before phones and the Internet, all communication was face-to-face. Now, most of it is digital, via emails and messaging services. If people were to start using virtual reality, it would almost come full circle.</span>
      </div>
    </div>
  )
}

export default ChatBox