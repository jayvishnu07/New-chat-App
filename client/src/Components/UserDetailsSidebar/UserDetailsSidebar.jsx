import React, { useEffect, useState } from 'react'
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { MdEmail, MdGroups, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import './UserDetailsSidebar.css'
import ScaleLoader from 'react-spinners/ScaleLoader';
import { IoMdClose } from 'react-icons/io';
import { BsSearch } from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import SearchNewFriends from '../Chat/SearchNewFriends';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { EntireChatState } from '../../ContextAPI/chatContext';


const UserDetailsSidebar = ({ setShowFriendDetail, chatInfo }) => {
    const [user, setUser] = useState({})
    const [showEditChatModel, setShowEditChatModel] = useState(false)
    const [groupProfilePic, setGroupProfilePic] = useState('');
    const [searchInput, setSearchInput] = useState('')
    const [newGroupName, setNewGroupName] = useState('');
    const [picLoading, setPicLoading] = useState(false);
    const [newFriends, setNewFriends] = useState([])
    const [newlyAddedFriends, setNewlyAddedFriends] = useState([]);
    const [newlyAddedFriendsObject, setNewlyAddedFriendsObject] = useState([]);


    useEffect(() => {

        setUser(JSON.parse(localStorage.getItem('userInfo')).data)
    }, [])

    const { id, name, mail_id, profilePic, token } = user;
    const { setSelectedChat, selectedChat, currentChat , setCurrentChat} = EntireChatState()



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
        console.log('newlyAddedFriends', newlyAddedFriends);
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

            const {data} = await axios.put(`http://localhost:8080/api/edit-group-chat/`, info, config)
            setSelectedChat(data)
            setCurrentChat((prev) => [...prev, data])
            console.log('data from created chat',data);
            setSearchInput('')
            onclose();
        } catch (error) {
            //toast
            console.log(error.message);
        }
        setShowEditChatModel(false);
    }

    console.log('chatInfo', chatInfo);

    return (
        <div className='user-sidebar-main-div'>
            <div className="sidebar-header">
                <div className="sidebar-header-feture-div">
                    <HiChevronDoubleLeft onClick={() => setShowFriendDetail(false)} id='cursor' size={25} />
                    <MdOutlineDriveFileRenameOutline size={25} onClick={() => { setShowEditChatModel(true); userOfTheSelectedGroup() }} id='cursor' />
                </div>
                <div className="dividing-border-div-top"></div>
            </div>

            {/* Edit group chat */}
            <Modal
                show={showEditChatModel}
                // onHide={() => setShowSearchFriends(false)}
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
                        <label htmlFor="profilePic" id='uploading-animaation' >Upload Profile {picLoading && <ScaleLoader height={10} />} </label>
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
                        <div key={key} id='cursor' className='friends-list-wrapper' onDoubleClick={() => { setSelectedChat(res); console.log('res', res); }} >
                            <div className="friends-list-main-wrapper-user-sidebar"  >
                                <img id='cursor' src={res.profilePic} className='friends-list-profile-user-sidebar' alt="proflie" />
                                <div className="new-friends-list-item">
                                    {res.name}
                                    <br />
                                    {`latest message`}
                                </div>
                            </div>
                            <div className="friends-list-item-bottom-border"></div>
                        </div>
                    )
                })
            }
            {/* {
                chatInfo?.isGroupChat &&
                chatInfo.users.map((res, key) => {
                    return (
                        <div key={key} id='cursor' className='friends-list-wrapper' onDoubleClick={() => { setSelectedChat(res); console.log('res', res); }} >
                            <div className="friends-list-main-wrapper-user-sidebar"  >
                                <img id='cursor' src={res.profilePic} className='friends-list-profile-user-sidebar' />
                                <div className="new-friends-list-item">
                                    {res.name}
                                    <br />
                                    {`latest message`}
                                </div>
                            </div>
                            <div className="friends-list-item-bottom-border"></div>
                        </div>
                    )
                })
            } */}

        </div>
    )
}

export default UserDetailsSidebar