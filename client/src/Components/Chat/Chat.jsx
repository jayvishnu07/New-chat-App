import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Chats.css'
import { GiMagicHat } from 'react-icons/gi';
import { BsSearch, BsFillChatRightTextFill } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import { MdNotifications } from 'react-icons/md';
import UserDetailsSidebar from '../UserDetailsSidebar/UserDetailsSidebar';
import { EntireChatState } from '../../ContextAPI/chatContext';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Offcanvas from 'react-bootstrap/Offcanvas';


const Chat = () => {

    const { setSelectedChat, selectedChat, currentChat, setCurrentChat } = EntireChatState()
    let user = JSON.parse(localStorage.getItem('userInfo'))
    const [chats, setChats] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [newFriends, setNewFriends] = useState([])
    const [showFriendDetail, setShowFriendDetail] = useState(false)
    const [show, setShow] = useState(false);
    const [showSearchFriends, setShowSearchFriends] = useState(false);
    const navigate = useNavigate()
    let sender;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        navigate('/auth')
        toast.success('🦄 Logout Successful!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    // useEffect(() => {
    //     console.log(user);
    // }, [user])

    const { _id, name, mail_id, profilePic, token } = user?.data;
    const onclose = () => {
        setShowSearchFriends(false);
        setNewFriends([])
    }

    const searchNewFriendHandler = async () => {
        console.log("here", token);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const result = await axios.get(`http://localhost:8080/user/search-new-friends?search=${searchInput}`, config)
        setNewFriends(result.data)
    }

    const accessChat = async (oppositeUserId) => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const result = await axios.post(`http://localhost:8080/api/get-chat/`, { oppositeUserId }, config)
            setSelectedChat(result)
            console.log('result', result);
            console.log('slectedChat', selectedChat);
            onclose();
        } catch (error) {
            //toast
            console.log(error.message);
        }
    }

    const getAllChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const result = await axios.get(`http://localhost:8080/api/get-all-chats/`, config);
            console.log(result);
            console.log(selectedChat);
            if (!currentChat.find((e) => e._id === selectedChat.data._id)) {
                setCurrentChat((prev) => [...prev, result.data])
            }
            setCurrentChat(result.data)
            // console.log("allchat", result);
            // onclose();
        } catch (error) {
            //toast
            console.log(error.message);
        }
    }

    const getSender = (users) => {
        return users[0]._id === _id ? users[0] : users[1];
    }

    useEffect(() => {
        getAllChats();
        console.log('called',currentChat);        
    }, [selectedChat])

    return (
        <>
            <div className="chat-component-header">
                <div className="left-header-features-wrapper">
                    <div className="user-profile">
                        <GiMagicHat size={30} id='cursor' />
                    </div>
                    <div className="left-header-features">
                        <FaUserFriends size={25} id='cursor' onClick={() => setShowSearchFriends(true)} />

                        {/*  starting of search new friends sidebar */}
                        <Offcanvas show={showSearchFriends} onHide={onclose} className='left-side-bar' >
                            <Offcanvas.Header >
                                <Offcanvas.Title>Search for new friends</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <div className="friends-list-search">
                                    <div className="search-box-wrapper">
                                        <BsSearch id='search-logo' onClick={searchNewFriendHandler} fill='#000' />
                                        <input type="text" onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => (e.code === 'Enter') ? searchNewFriendHandler() : null} placeholder='Search Friends...' />
                                    </div>
                                </div>

                                <div className="new-friends-search-main-div">
                                    {
                                        newFriends.map((newFriend, key) => {
                                            return (
                                                <div key={key} >
                                                    <div className="new-friends-list-item-bottom-border"></div>
                                                    <div className="new-friends-list-item-wrapper" id='cursor' onClick={() => accessChat(newFriend._id)}>
                                                        <img id='cursor' src={newFriend.profilePic} className='new-friends-list-profile' alt="proflie" />
                                                        <div className="new-friends-list-item">
                                                            {newFriend.name}
                                                            <br />
                                                            {`latest message`}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="new-friends-list-item-bottom-border"></div>
                                </div>

                            </Offcanvas.Body>
                        </Offcanvas>
                        {/*  ending of search new friends sidebar */}

                        <BsFillChatRightTextFill size={25} id='cursor' />
                        <MdNotifications size={25} id='cursor' />
                    </div>
                </div>
                <div className="righ-header-features-wrapper">
                    <div className="application-name">
                        Magic Hat
                    </div>
                    <div className="setting-and-profile-feature">
                        <img id='cursor' src={profilePic} alt="proflie" onClick={handleShow} />

                        {/* Model */}
                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton className='model-header' >
                                <Modal.Title>{name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='model-body' >
                                <img id='proflie-in-model' src={profilePic} alt="proflie" />
                                <div className="model-body-mail_id">{mail_id}</div>
                            </Modal.Body>
                            <Modal.Footer className='model-footer' >
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Modal.Footer>
                        </Modal>
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
                        {
                            currentChat &&
                            currentChat.map((res, key) => {
                                return (
                                    <div key={key} id='cursor' className='friends-list-wrapper'>
                                        <div className="new-friends-list-item-wrapper"  >
                                            <img id='cursor' src={res.isGroupChat ? '' : getSender(res.users).profilePic} className='new-friends-list-profile' alt="proflie" />
                                            <div className="new-friends-list-item">
                                                {res.isGroupChat ? res.chatName : getSender(res.users).name}
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
                {/* <div className="chat-box-main-div" style={showFriendDetail ? { width: "50%" } : { width: "75%" }}> */}
                <div className="chat-and-user-detail-wrapper-main">
                    <div className="chat-box-main-div">
                        <div className="fellow-user-details-header">
                            <div className="chat-box-feature-left">
                                <CgProfile size={30} id='cursor' />
                                Friend's name
                            </div>
                            <div className="show-fellow-user-details">
                                <AiFillSetting size={25} id='cursor' onClick={() => { setShowFriendDetail(true) }} />
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
                    {showFriendDetail && <UserDetailsSidebar setShowFriendDetail={setShowFriendDetail} />}
                </div>

            </div>
        </>
    )
}

export default Chat

