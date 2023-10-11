import React, { useEffect, useState } from 'react'
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { MdEmail, MdGroups, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import './UserDetailsSidebar.css'
import ScaleLoader from 'react-spinners/ScaleLoader';
import { IoMdClose } from 'react-icons/io';
import { BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import SearchNewFriends from '../Chat/SearchNewFriends';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { EntireChatState } from '../../ContextAPI/chatContext';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import UserDetailsHeader from './UserDetailsHeader';
import { FcApproval } from 'react-icons/fc';


const UserDetailsSidebar = ({ setShowFriendDetail, chatInfo }) => {
    const [user, setUser] = useState({})
    const [showEditChatModel, setShowEditChatModel] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [newGroupName, setNewGroupName] = useState('');
    const [groupProfilePic, setGroupProfilePic] = useState('');
    const [picLoading, setPicLoading] = useState(false);
    const [newFriends, setNewFriends] = useState([])
    const [newlyAddedFriends, setNewlyAddedFriends] = useState([]);
    const [newlyAddedFriendsObject, setNewlyAddedFriendsObject] = useState([]);
    const [dropDownUserId, setDropDownUserId] = useState('');
    const [showDropDown, setShowDropDown] = useState(false);
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('userToken')))

    const [render, setRender] = useState(false)


    const { setSelectedChat, selectedChat, currentChat, setCurrentChat } = EntireChatState()

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('userInfo')))
    }, [])

    const { id } = user;



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
    }

    const searchNewFriendHandler = async () => {
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

    const addFriendsToChat = (newUser) => {
        setNewlyAddedFriends([...newlyAddedFriends, newUser._id])
        if (newlyAddedFriendsObject.find(e => e._id === newUser._id)) {
            //Toast
            return
        }

        setNewlyAddedFriendsObject([...newlyAddedFriendsObject, newUser])
    }

    const removeUserFromAddingGroup = (userId) => {
        setNewlyAddedFriendsObject(newlyAddedFriendsObject.filter(e => e._id !== userId))
    }

    const userOfTheSelectedGroup = () => {
        let { users } = selectedChat;
        setNewlyAddedFriendsObject(users.filter(e => e._id !== id))
    }

    useEffect(() => {
        setNewlyAddedFriends(newlyAddedFriendsObject.map(e => e._id))
    }, [newlyAddedFriendsObject])

    useEffect(() => {
    }, [newlyAddedFriends])


    const editGroupChat = async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const info = {
                chatId: selectedChat._id,
                newGroupName: newGroupName,
                groupProfile: groupProfilePic,
                users: JSON.stringify(newlyAddedFriends)
            }

            const { data } = await axios.put(`http://localhost:8080/api/edit-group-chat/`, info, config)
            setSelectedChat(data)
            setCurrentChat((prev) => [...prev, data])
            setSearchInput('')
            onclose();
        } catch (error) {
            //toast
            console.log(error.message);
        }
        setShowEditChatModel(false);
    }

    const removeFromGroup = async (idOfUserToBeRemoved) => {
        if (selectedChat?.groupAdmin?._id === id) {
            try {
                const config = {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }

                const info = {
                    chatId: selectedChat._id,
                    idOfUserToBeRemoved
                }

                const { data } = await axios.put(`http://localhost:8080/api/remove-friend-from-group/`, info, config)
                setSelectedChat(data)
                setCurrentChat((prev) => [...prev, data])
                onclose();

            } catch (error) {
                //toast
                console.log(error.message);
            }

        }

        setShowDropDown(false)

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
            console.log("hhh",data);
            setSelectedChat(data)
        } catch (error) {
            //toast            
            console.log(error.message);
        }
    }


    const showDropDownFun = (res) => {
        setDropDownUserId(res._id);
        setShowDropDown(prev => !prev)
    }

    return (
        <div className='user-sidebar-main-div'>
            <div className="sidebar-header">
                <UserDetailsHeader setShowFriendDetail={setShowFriendDetail} />
            </div>
            {/* Edit group chat */}
            <Modal
                show={showEditChatModel}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className='model-header' >
                    <Modal.Title>Edit Group Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body className='new-chat-model-body' >
                    <div className="new-chat-form">
                        <label htmlFor="chatName">Group Name</label>
                        <input onChange={e => { setNewGroupName(e.target.value) }} type="text" placeholder='Group Name...' />
                        <label style={{fontSize : "600"}} htmlFor="profilePic" id='uploading-animaation' >Upload Profile {picLoading && <ScaleLoader height={10} />} </label>
                        <input onChange={(e) => profilePicHandler(e.target.files[0])} className='new-chat-form-input-file' name='profilePic' type="file" placeholder='ConfirmPassword' />
                    </div>
                    {
                        newlyAddedFriendsObject.length && (
                            <div className="added-friends-to-new-chat-div">
                                {
                                    newlyAddedFriendsObject.map((res, key) => {
                                        return (
                                            <div key={key} className='added-friends-to-new-chat' > {res.name} <IoMdClose id='cursor' onClick={() => { removeUserFromAddingGroup(res._id) }} /> </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                    <div className="search-box-wrapper new-chat-search-box-wrapper">
                        <BsSearch id='search-logo' onClick={searchNewFriendHandler} fill='#000' />
                        <input type="text" onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => (e.code === 'Enter') ? searchNewFriendHandler() : null} placeholder='Search Friends...' />
                    </div>
                    <div className="new-chat-model-searching">
                        <SearchNewFriends newFriends={newFriends} accessChat={addFriendsToChat} />
                    </div>
                </Modal.Body>
                <Modal.Footer className='model-footer' >
                    <Button variant="secondary" onClick={() => { setShowEditChatModel(false); setNewFriends([]); setNewlyAddedFriendsObject([]) }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editGroupChat}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>


            <div className="friend-profile-wrapper">
                <img src={!chatInfo?.isGroupChat ? chatInfo?.profilePic : chatInfo?.groupProfile} className="friend-profile"></img>
                <div className="friend-name">
                    {chatInfo?.name}
                </div>
            </div>
            <div className="friends-list-item-top-border"></div>
            <div className="email-div-or-participants-title">{chatInfo?.isGroupChat ? <> <MdGroups color='#fff' size={25} /> {' Group Participants ~'} </> : <><MdEmail size={24} color='#fff' /> {`Email : ${chatInfo?.mail_id}`} </>} </div>
            <div className="friends-list-item-top-border"></div>
            {
                chatInfo?.isGroupChat &&
                chatInfo.users.map((res, key) => {
                    return (
                        <div key={key} className='friends-list-wrapper-user-sidebar' >
                            <div className="friends-list-main-wrapper-user-sidebar"  >
                                <img id='cursor' src={res.profilePic} className='friends-list-profile-user-sidebar' alt="proflie" />
                                <div className="new-friends-list-item">
                                    <span id='group-participant-name' >

                                        {res._id === id ? `You` : res.name} {(selectedChat?.groupAdmin?._id === res._id) && <FcApproval />}
                                    </span>
                                    <br />
                                    <span id='group-participant-mail_id' >
                                        {res.mail_id}
                                    </span>
                                </div>
                                {
                                    ((selectedChat?.groupAdmin?._id !== res._id) || (selectedChat?.groupAdmin?._id !== id)) && res._id !== id &&
                                    <div className='group-participant-settings' >
                                        <BsThreeDotsVertical size={18} onClick={() => { showDropDownFun(res) }} />
                                        <div className={showDropDown && (dropDownUserId === res._id) ? "drop-down" : 'none'} onMouseLeave={() => setShowDropDown(false)} >
                                            <div className="go-to-chat" onClick={() => { accessChat(res); setShowDropDown(false); setShowFriendDetail(false) }} >{`Message ${res.name}`}</div>
                                            {(selectedChat?.groupAdmin?._id === id) && <div className="remove-from-chat" onClick={() => removeFromGroup(res._id)} >Remove from Chat</div>}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="friends-list-item-bottom-border"></div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default UserDetailsSidebar