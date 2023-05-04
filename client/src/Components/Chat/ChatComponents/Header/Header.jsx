import React, { useEffect, useState } from 'react'
import './Header.css'
import { GiMagicHat } from 'react-icons/gi';
import { BsSearch, BsFillChatRightTextFill } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdNotifications } from 'react-icons/md';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

import Offcanvas from 'react-bootstrap/Offcanvas';
import SearchNewFriends from '../../SearchNewFriends';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { EntireChatState } from '../../../../ContextAPI/chatContext';




const Header = () => {
    const [searchInput, setSearchInput] = useState('')
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({})
    const navigate = useNavigate()
    const [newFriends, setNewFriends] = useState([])
    const [groupProfilePic, setGroupProfilePic] = useState('');
    const [groupName, setGroupName] = useState('');
    const [picLoading, setPicLoading] = useState(false);
    const [showCreateChatModel, setShowCreateChatModel] = useState(false);
    const [newlyAddedFriends, setNewlyAddedFriends] = useState([]);
    const [showSearchFriends, setShowSearchFriends] = useState(false);
    const [newlyAddedFriendsObject, setNewlyAddedFriendsObject] = useState([]);


    const { setSelectedChat, selectedChat } = EntireChatState()

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('userInfo')).data)
    }, [])

    const { id, name, mail_id, profilePic, token } = user;

    //LOGOUT LOGIC
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


    const onclose = () => {
        setShowSearchFriends(false);
        setNewFriends([])
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const searchNewFriendHandler = async () => {
        console.log("here", token);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            if (searchInput) {
                const { data } = await axios.get(`http://localhost:8080/user/search-new-friends?search=${searchInput}`, config)
                setNewFriends(data)
            }

        } catch (error) {
            console.log("error from searching friends", error.message);
        }
    }

    const accessChat = async (oppositeUser) => {
        const oppositeUserId = oppositeUser._id;
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`http://localhost:8080/api/get-message`, { oppositeUserId }, config)
            setSelectedChat(data)
            onclose();
        } catch (error) {
            //toast            
            console.log(error.message);
        }
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

            const info = {
                groupName: groupName,
                groupProfile: groupProfilePic,
                users: JSON.stringify(newlyAddedFriends)
            }

            const { data } = await axios.post(`http://localhost:8080/api/create-new-chat/`, info, config)
            setSelectedChat(data)
            onclose();
            setNewFriends([])
        } catch (error) {
            //toast
            console.log(error.message);
        }
        setShowCreateChatModel(false);
    }

    const removeUserFromAddingGroup = (userId) => {
        setNewlyAddedFriendsObject(newlyAddedFriendsObject.filter(e => e._id !== userId))
    }

    return (
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
    )
}

export default Header