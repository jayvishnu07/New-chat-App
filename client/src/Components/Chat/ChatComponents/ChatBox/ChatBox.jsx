import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './ChatBox.css'
import { GiMagicHat } from 'react-icons/gi';
import { BsSearch } from 'react-icons/bs';
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import UserDetailsSidebar from '../../../UserDetailsSidebar/UserDetailsSidebar';
import { toast } from 'react-toastify';
import { EntireChatState } from '../../../../ContextAPI/chatContext';

const ChatBox = () => {
    const { setSelectedChat, selectedChat, currentChat, setCurrentChat } = EntireChatState()
    const [user, setUser] = useState({})
    const [showFriendDetail, setShowFriendDetail] = useState(false)
    const [render, setRender] = useState(false)
    const [chats, setChats] = useState([])
    let sender;

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('userInfo')))
    }, [])

    const { id, name, mail_id, profilePic, token } = user;


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
            setRender(prev=>!prev)
            console.log('currentChat',currentChat);
        } catch (error) {
            //toast
            console.log(error.message);
        }
    }

    const getSender = (users) => {
        return (users && (users[0]?._id === id ? users[1] : users[0]))
    }

    useEffect(() => {
        setCurrentChat(currentChat.filter(e => e._id !== id))
        console.log('currentChat',currentChat);

    }, [])
    
    useEffect(() => {
        getAllChats();
        console.log('currentChat',currentChat);
        
    }, [selectedChat, user])
    

    return (
        <div className='chat-body-main-div' >
            <div className="friends-list-main-wrapper">
                <div className="friends-list-search">
                    <div className="search-box-wrapper">
                        <BsSearch id='search-logo' />
                        <input type="text" placeholder='Search Friends...' />
                    </div>
                </div>
                {
            console.log('currentChat',currentChat)

                }
                <div className="friends-list-div">
                    {
                        currentChat &&
                        currentChat.map((res, key) => {
                            return (
                                <div key={key} id='cursor' onClick={() => setSelectedChat(res)} className={res._id === selectedChat._id ?'friends-list-wrapper-selected' :'friends-list-wrapper'}>
                                    {console.log("currentChat",currentChat)}
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

                    </div>
                    <div className="chat-box-input-wrapper">
                        <div className="chat-box-input-box">
                            <input type="text" placeholder='Type your message here...' />
                            <div className="send-logo-div">
                                send
                                <AiOutlineSend size={30} fill='#fff' />
                            </div>
                        </div>
                        <div className="chat-box-input-bottom-border"></div>
                    </div>
                </div>
               {showFriendDetail && <UserDetailsSidebar user chatInfo={ selectedChat.users ?  (!selectedChat.isGroupChat) ? getSender(selectedChat.users) : selectedChat : selectedChat} setShowFriendDetail={setShowFriendDetail}  />}
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