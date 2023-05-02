import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Chats.css'
import { GiMagicHat } from 'react-icons/gi';
import { BsSearch, BsFillChatRightTextFill } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { MdNotifications } from 'react-icons/md';
import UserDetailsSidebar from '../UserDetailsSidebar/UserDetailsSidebar';
import { EntireChatState } from '../../ContextAPI/chatContext';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Offcanvas from 'react-bootstrap/Offcanvas';
import SearchNewFriends from './SearchNewFriends';
import ScaleLoader from 'react-spinners/ScaleLoader';


const Chat = () => {

    const { setSelectedChat, selectedChat, currentChat, setCurrentChat } = EntireChatState()
    let user = JSON.parse(localStorage.getItem('userInfo'))
    const [chats, setChats] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [newFriends, setNewFriends] = useState([])
    const [showFriendDetail, setShowFriendDetail] = useState(false)
    const [show, setShow] = useState(false);
    const [showCreateChatModel, setShowCreateChatModel] = useState(false);
    const [showSearchFriends, setShowSearchFriends] = useState(false);
    const [newlyAddedFriends, setNewlyAddedFriends] = useState([]);
    const [newlyAddedFriendsObject, setNewlyAddedFriendsObject] = useState([]);
    const [groupProfilePic, setGroupProfilePic] = useState('');
    const [groupName, setGroupName] = useState('');
    const [picLoading, setPicLoading] = useState(false);
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
        if (searchInput) {
            const result = await axios.get(`http://localhost:8080/user/search-new-friends?search=${searchInput}`, config)
            setNewFriends(result.data)
        }
    }

    const accessChat = async (oppositeUser) => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const result = await axios.post(`http://localhost:8080/api/get-chat/`, oppositeUser._id, config)
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
            let result = await axios.get(`http://localhost:8080/api/get-all-chats/`, config);
            result = result.data;
            console.log(result);
            console.log(selectedChat);
            console.log(currentChat);
            if (!(result.find((e) => e._id === selectedChat?.data?._id))) {
                setCurrentChat((prev) => [...prev, result.data])
                console.log("added");
            }
            setCurrentChat(result)
            // console.log("allchat", result);
            // onclose();
        } catch (error) {
            //toast
            console.log(error.message);
        }
    }

    const getSender = (users) => {
        return (users && (users[0]?._id === _id ? users[0] : users[1]))
    }
    const addFriendsToChat = (newUser) => {
        setNewlyAddedFriends([...newlyAddedFriends, newUser._id])
        if (newlyAddedFriendsObject.find(e => e._id === newUser._id)) {
            //Toast
            return
        }

        setNewlyAddedFriendsObject([...newlyAddedFriendsObject, newUser])
    }

    const profilePicHandler = (pic) => {
        // setLoading(true);
        setPicLoading(true)

        if (pic === undefined) {
            toast.warn('🦄 Please Select a Image.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "Chat-Application");
            data.append("cloud_name", "djn1saw5y");
            fetch("https://api.cloudinary.com/v1_1/djn1saw5y/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setGroupProfilePic(data.url.toString());
                    console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast.warn('🦄 it is not a Image.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setPicLoading(false);
            return;
        }
        console.log(pic);
    }

    const createGroupChat = async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const data = {
                groupName: groupName,
                groupProfile: groupProfilePic,
                users: JSON.stringify(newlyAddedFriends)
            }

            const result = await axios.post(`http://localhost:8080/api/create-new-chat/`, data, config)
            setSelectedChat(result)
            console.log('result', result);
            console.log('slectedChat', selectedChat);
            onclose();
        } catch (error) {
            //toast
            console.log(error.message);
        }
        setShowCreateChatModel(false);
    }
    useEffect(() => {

        // console.log('newlyAddedFriends', newlyAddedFriends);
        // console.log('newlyAddedFriendsObject', newlyAddedFriendsObject);
    }, [newlyAddedFriends])

    useEffect(() => {
        getAllChats();
        // console.log('currentChat', currentChat);
        console.log('selectedChat', selectedChat);
        console.log('selectedChat', selectedChat.length);
    }, [selectedChat])

    const removeUserFromAddingGroup = (userId) => {
        setNewlyAddedFriendsObject(newlyAddedFriendsObject.filter(e => e._id !== userId))
    }

    const createNewChat = async () => {

        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            let result = await axios.post(`http://localhost:8080/api/create-new-chat/`, {}, config);
            result = result.data;
            console.log('created gropu chat', result);
            setCurrentChat(result)
        } catch (error) {
            //toast
            console.log(error.message);
        }
    }


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
                                    <SearchNewFriends newFriends={newFriends} accessChat={accessChat} />
                                </div>

                            </Offcanvas.Body>
                        </Offcanvas>
                        {/*  ending of search new friends sidebar */}

                        <BsFillChatRightTextFill size={25} id='cursor' onClick={() => setShowCreateChatModel(true)} />
                        {/* create chat model */}
                        <Modal
                            show={showCreateChatModel}
                            onHide={() => setShowSearchFriends(false)}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header className='model-header' >
                                <Modal.Title>Create New Group Chat</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='new-chat-model-body' >
                                <div className="new-chat-form">
                                    <label htmlFor="chatName">Group Name</label>
                                    <input onChange={e => { setGroupName(e.target.value) }} type="text" placeholder='Group Name...' />
                                    <label htmlFor="profilePic" id='uploading-animaation' >Upload Profile {picLoading && <ScaleLoader height={10} />} </label>
                                    <input onChange={(e) => profilePicHandler(e.target.files[0])} className='new-chat-form-input-file' name='profilePic' type="file" placeholder='ConfirmPassword' />
                                </div>
                                <div className="added-friends-to-new-chat-div">
                                    {
                                        newlyAddedFriendsObject.map((res, key) => {
                                            return (
                                                <div key={key} className='added-friends-to-new-chat' > {res.name} <IoMdClose id='cursor' onClick={() => { removeUserFromAddingGroup(res._id) }} /> </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="search-box-wrapper new-chat-search-box-wrapper">
                                    <BsSearch id='search-logo' onClick={searchNewFriendHandler} fill='#000' />
                                    <input type="text" onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => (e.code === 'Enter') ? searchNewFriendHandler() : null} placeholder='Search Friends...' />
                                </div>
                                <div className="new-chat-model-searching">
                                    <SearchNewFriends newFriends={newFriends} accessChat={addFriendsToChat} />
                                </div>
                            </Modal.Body>
                            <Modal.Footer className='model-footer' >
                                <Button variant="secondary" onClick={() => { setShowCreateChatModel(false); setNewFriends([]); setNewlyAddedFriendsObject([]) }}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={createGroupChat}>
                                    Create
                                </Button>
                            </Modal.Footer>
                        </Modal>
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
                                    <div key={key} id='cursor' onClick={() => setSelectedChat(res)} className='friends-list-wrapper'>
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
                <div className={selectedChat.length !== 0 ? "chat-and-user-detail-wrapper-main" : 'none'}>
                    <div className="chat-box-main-div">
                        <div className="fellow-user-details-header">
                            <div className="chat-box-feature-left">
                                {/* <CgProfile size={30} id='cursor' /> */}
                                <img id='cursor' src={selectedChat.isGroupChat ? selectedChat?.groupProfile : getSender(selectedChat.users)?.profilePic} onClick={() => { setShowFriendDetail(true) }} className='opposite-user-profile-in-top-bar' alt="proflie" />
                                { !selectedChat.isGroupChat ? getSender(selectedChat?.users)?.name : selectedChat.chatName}
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
                    {showFriendDetail && <UserDetailsSidebar chatInfo={!selectedChat.isGroupChat ? getSender(selectedChat.users) : selectedChat}   setShowFriendDetail={setShowFriendDetail} />}
                </div>
                <div className={selectedChat.length === 0 ? 'no-chat-notify' : 'none'} >No Chats Yet . . . !</div>
            </div>
        </>
    )
}

export default Chat

