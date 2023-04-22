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

    const { user } = EntireChatState()
    const [chats, setChats] = useState([])
    const [showFriendDetail, setShowFriendDetail] = useState(false)
    const [show, setShow] = useState(false);
    const [showSearchFriends, setShowSearchFriends] = useState(false);
    const navigate = useNavigate()

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

    useEffect(() => {
        console.log(user);
    }, [user])

    const { name, mail_id, profilePic } = user?.data;

    // const toggleShowDetails=()=>{
    //     setShowFriendDetail((prev)=>{!prev})
    // }

    return (
        <>
            <div className="chat-component-header">
                <div className="left-header-features-wrapper">
                    <div className="user-profile">
                        <GiMagicHat size={30} id='cursor' />
                    </div>
                    <div className="left-header-features">
                        <FaUserFriends size={25} id='cursor' onClick={() => setShowSearchFriends(true)} />
                        <Offcanvas show={showSearchFriends} onHide={() => setShowSearchFriends(false)} className='left-side-bar' >
                            <Offcanvas.Header >
                                <Offcanvas.Title>Search for new friends</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <div className="friends-list-search">
                                    <div className="search-box-wrapper">
                                        <BsSearch id='search-logo' fill='#000' />
                                        <input type="text" placeholder='Search Friends...' />
                                    </div>
                                </div>
                            </Offcanvas.Body>
                        </Offcanvas>



                        <BsFillChatRightTextFill size={25} id='cursor' />
                        <MdNotifications size={25} id='cursor' />
                    </div>
                </div>
                <div className="righ-header-features-wrapper">
                    <div className="application-name">
                        Magic Hat
                    </div>
                    <div className="setting-and-prfile-feature">
                        {/* <CgProfile size={30} id='cursor' /> */}
                        <img id='cursor' src={profilePic} alt="proflie" onClick={handleShow} />

                        {/* Model */}
                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>{name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='model-body' >
                                <img id='proflie-in-model' src={profilePic} alt="proflie" />
                                <div className="model-body-mail_id">{mail_id}</div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="outline-secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="outline-danger" onClick={handleLogout}>
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

                        <div className="friends-list-item">
                            Jvs
                        </div>
                        <div className="friends-list-item-bottom-border"></div>
                        <div className="friends-list-item">
                            Jai
                        </div>
                        <div className="friends-list-item-bottom-border"></div>
                        <div className="friends-list-item">
                            vishnu
                        </div>
                        <div className="friends-list-item-bottom-border"></div>

                    </div>
                </div>
                {/* chat box  */}
                <div className="chat-box-main-div" style={showFriendDetail ? { width: "50%" } : { width: "75%" }}>
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
        </>
    )
}

export default Chat

