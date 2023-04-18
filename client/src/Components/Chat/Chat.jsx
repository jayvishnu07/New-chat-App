import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Chats.css'
import { GiMagicHat } from 'react-icons/gi';
import { BsSearch, BsChatFill } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { AiFillSetting , AiOutlineSend} from 'react-icons/ai';
import { MdNotifications } from 'react-icons/md';

const Chat = () => {

    const [chats, setChats] = useState([])

    return (
        <>
            <div className="chat-component-header">
                <div className="left-header-features-wrapper">
                    <div className="user-profile">
                        <GiMagicHat size={30} id='cursor' />
                    </div>
                    <div className="left-header-features">
                        <FaUserFriends size={25} id='cursor' />
                        <BsChatFill size={25} id='cursor' />
                        <MdNotifications size={25} id='cursor' />
                    </div>
                </div>
                <div className="righ-header-features-wrapper">
                    <div className="application-name">
                        Magic Hat
                    </div>
                    <div className="setting-and-prfile-feature">
                        <CgProfile size={30} id='cursor' />
                        {/* <AiFillSetting size={30} id='cursor' /> */}
                    </div>
                </div>
            </div>
            <div className='chat-body-main-div' >
                <div className="friends-list-main-wrapper">
                    <div className="friends-list-search">
                        <div className="search-box-wrapper">
                            <BsSearch id='search-logo' />
                            <input type="text" placeholder='Search Friends...' />
                        </div>
                    </div>
                    <div className="friends-list-div">

                        <div className="friends-list-item">
                            Jvs
                        </div>
                        <div className="friends-list-item">
                            Jai
                        </div>
                        <div className="friends-list-item">
                            vishnu
                        </div>

                    </div>
                </div>
                <div className="chat-box-main-div">
                    <div className="fellow-user-details-header">
                        <div className="chat-box-feature-left">
                            <CgProfile size={30} id='cursor' />
                            Friend's name
                        </div>
                        <div className="show-fellow-user-details">
                            <AiFillSetting size={30} id='cursor' />
                        </div>
                    </div>
                    <div className="main-chat-box">

                    </div>
                    <div className="chat-box-input-wrapper">
                        <div className="chat-box-input-box">
                            <input type="text"  placeholder='Type your message here...' />
                            <div className="send-logo-div">
                                send
                                <AiOutlineSend  size={30} fill='#fff'  />
                            </div>
                        </div>
                        <div className="chat-box-input-bottom-border"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat

