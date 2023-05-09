import React, { useEffect, useState } from 'react'
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import './UserDetailsSidebar.css'
import './UserDetailsHeader.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { EntireChatState } from '../../ContextAPI/chatContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { BsSearch } from 'react-icons/bs';
import SearchNewFriends from '../Chat/SearchNewFriends';
import { IoMdClose } from 'react-icons/io';
import { GiExitDoor } from 'react-icons/gi';
import { AiFillDelete } from 'react-icons/ai';


const UserDetailsHeader = ({ setShowFriendDetail }) => {
    const [user, setUser] = useState({})
    const [headerEditDropDown, setHeaderEditDropDown] = useState(false);
    const [showEditChatName, setShowEditChatName] = useState(false);
    const [showEditChatProfile, setShowEditChatProfile] = useState(false);
    const [showEditChatMembers, setShowEditChatMembers] = useState(false);
    const [showExitGroup, setShowExitGroup] = useState(false);
    const [showDeleteGroup, setShowDeleteGroup] = useState(false);

    const [token, setToken] = useState(JSON.parse(localStorage.getItem('userToken')))

    //

    const [newChatName, setNewChatName] = useState('')
    const [groupProfilePic, setGroupProfilePic] = useState('');
    const [picLoading, setPicLoading] = useState(false);
    const [newlyAddedFriends, setNewlyAddedFriends] = useState([]);
    const [newlyAddedFriendsObject, setNewlyAddedFriendsObject] = useState([]);
    const [searchInput, setSearchInput] = useState('')
    const [newFriends, setNewFriends] = useState([])
    const [newAdminId, setNewAdminId] = useState('')
    const [showUpdateNewAdmin, setShowUpdateNewAdmin] = useState(true)


    useEffect(() => {

        setUser(JSON.parse(localStorage.getItem('userInfo')))
    }, [])

    const { setSelectedChat, selectedChat, currentChat, setCurrentChat } = EntireChatState()


    const { id, name, mail_id, profilePic } = user;


    useEffect(() => {
        setNewlyAddedFriends(newlyAddedFriendsObject.map(e => e._id))
    }, [newlyAddedFriendsObject])



    const userOfTheSelectedGroup = () => {
        let { users } = selectedChat;
        setNewlyAddedFriendsObject(users.filter(e => e._id !== id))
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
        setSearchInput('')
    }

    const editChatName = async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const info = {
                chatId: selectedChat._id,
                newGroupName: newChatName,
            }

            const { data } = await axios.put(`http://localhost:8080/api/edit-chat-name/`, info, config)
            setSelectedChat(data)
            setCurrentChat((prev) => [...prev, data])

        } catch (error) {
            //toast
            console.log(error.message);
        }
        setNewChatName('')
        setShowEditChatName(false)
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

    const editChatProfile = async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const info = {
                chatId: selectedChat._id,
                groupProfile: groupProfilePic,
            }

            const { data } = await axios.put(`http://localhost:8080/api/edit-chat-profile/`, info, config)
            setSelectedChat(data)
            setCurrentChat((prev) => [...prev, data])

            setGroupProfilePic('')
            setShowEditChatProfile(false)
        } catch (error) {
            //toast
            console.log(error.message);
        }
    }

    const editChatMembers = async () => {
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
                    users: JSON.stringify(newlyAddedFriends)
                }

                const { data } = await axios.put(`http://localhost:8080/api/edit-chat-members/`, info, config)
                setSelectedChat(data)
                setCurrentChat((prev) => [...prev, data])

            } catch (error) {
                //toast
                console.log(error.message);
            }
        }
        else {
            toast.warning('🦄 Only Admin can edit Group Participants.', {
                position: "top-center",
                autoClose: 900,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        setSearchInput('')
        setShowEditChatMembers(false)
    }

    const exitFromGroup = async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const info = {
                chatId: selectedChat._id,
                idOfUserToBeRemoved: id,
                newAdminId: newAdminId
            }
            let data;
            if (selectedChat?.groupAdmin?._id === id) {
                const result = await axios.put(`http://localhost:8080/api/admin-exit-from-group/`, info, config)
                data = result.data;
            }
            else {
                const result = await axios.put(`http://localhost:8080/api/remove-friend-from-group/`, info, config)
                data = result.data;
            }
            setSelectedChat()
        } catch (error) {
            //toast
            console.log(error.message);
        }
        setShowExitGroup(false)
    }

    const setNewAdminIdFun = (id) => {
        setNewAdminId(id);
        toast.success('🦄 New Admin Updated.', {
            position: "top-center",
            autoClose: 900,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setShowUpdateNewAdmin(false)
    }

    const deleteGroup = async () => {
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
                }

                const { data } = await axios.put(`http://localhost:8080/api/delete-group/`, info, config)
                setSelectedChat({})
            } catch (error) {
                //toast
                console.log(error.message);
            }
        }
        else {
            toast.warning('🦄 Only Admin can delete the Group.', {
                position: "top-center",
                autoClose: 900,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        setShowDeleteGroup(false)
    }

    return (
        <>
            <div className="sidebar-header-feture-div">
                <HiChevronDoubleLeft onClick={() => setShowFriendDetail(false)} id='cursor' size={25} />
                {/* () => { setShowEditChatModel(true); userOfTheSelectedGroup() } */}
                <MdOutlineDriveFileRenameOutline onClick={() => setHeaderEditDropDown(prev => !prev)} className='header-edit-icon' id='cursor' size={25} />
                <div className={headerEditDropDown ? "header-drop-down" : 'none-header'} onMouseLeave={() => setHeaderEditDropDown(false)} >

                    {/****************** EDIT GROUP NAME *********************/}
                    <div className="edit-group-name" onClick={() => { setShowEditChatName(true); setHeaderEditDropDown(false) }} >Change Group Name</div>
                    <Modal
                        show={showEditChatName}
                        onHide={() => setShowEditChatName(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Change Group Name</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input onChange={(e) => { setNewChatName(e.target.value) }} type="text" placeholder='Enter chat name...' />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditChatName(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={editChatName} >Change</Button>
                        </Modal.Footer>
                    </Modal>


                    {/****************** EDIT GROUP PROFILE *********************/}
                    <div className="edit-group-profile" onClick={() => { setShowEditChatProfile(true); setHeaderEditDropDown(false) }} >Change Group Profile</div>
                    <Modal
                        show={showEditChatProfile}
                        onHide={() => setShowEditChatProfile(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Change Group Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label htmlFor="profilePic" id='uploading-animaation' >Upload Profile {picLoading && <ScaleLoader height={10} />} </label>
                            <input onChange={(e) => profilePicHandler(e.target.files[0])} className='new-chat-form-input-file' name='profilePic' type="file" placeholder='ConfirmPassword' />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditChatProfile(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={editChatProfile} >Change</Button>
                        </Modal.Footer>
                    </Modal>

                    {/****************** EDIT GROUP MEMBERS *********************/}
                    <div className="edit-group-members" onClick={() => { setShowEditChatMembers(true); setHeaderEditDropDown(false); userOfTheSelectedGroup() }} >Add/Remove Group Members</div>
                    <Modal
                        show={showEditChatMembers}
                        onHide={() => setShowEditChatProfile(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Add/Remove Group Members</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
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
                            <br />
                            <b>
                                <span style={{ color: 'red' }} >Note : </span> Only Admin can edit Group Participants.
                            </b>
                            <div className="search-box-wrapper new-chat-search-box-wrapper">
                                <BsSearch id='search-logo' onClick={searchNewFriendHandler} fill='#000' />
                                <input type="text" onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => (e.code === 'Enter') ? searchNewFriendHandler() : null} placeholder='Search Friends...' />
                            </div>
                            <div className="new-chat-model-searching">
                                <SearchNewFriends newFriends={newFriends} accessChat={addFriendsToChat} />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { setShowEditChatMembers(false); setNewFriends([]); }}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => { editChatMembers(); setNewFriends([]); }} >Update</Button>
                        </Modal.Footer>
                    </Modal>

                    {/****************** EXIT FROM GROUP *********************/}
                    <div className="exit-from-group" onClick={() => { setShowExitGroup(true); setHeaderEditDropDown(false); userOfTheSelectedGroup() }} >Leave Group <GiExitDoor size={20} /> </div>
                    <Modal
                        show={showExitGroup}
                        onHide={() => setShowExitGroup(false)}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Leave Group <GiExitDoor /> </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <b>
                                Are you sure...? You want to exit Group?
                            </b>
                            <br />
                            {
                                (selectedChat?.groupAdmin?._id === id) && showUpdateNewAdmin &&
                                <>
                                    <span> <span style={{ color: "red" }} >Note : </span> As you are the Admin of this group, you have to promote anyone in this group to be next Admin. </span>

                                    {
                                        newlyAddedFriendsObject && (
                                            <div className="added-friends-to-new-chat-div">
                                                {
                                                    newlyAddedFriendsObject.map((res, key) => {
                                                        return (
                                                            <div key={key} className='added-friends-to-new-chat' id='cursor' onClick={() => { setNewAdminIdFun(res._id) }} > {res.name} </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                </>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowExitGroup(false)}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={exitFromGroup} >Leave </Button>
                        </Modal.Footer>
                    </Modal>

                    {/****************** DELETE GROUP *********************/}
                    <div className="deleted-group" onClick={() => { setShowDeleteGroup(true); setHeaderEditDropDown(false) }} >Deleted Group <AiFillDelete size={17} /> </div>
                    <Modal
                        show={showDeleteGroup}
                        onHide={() => setShowDeleteGroup(false)}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Delete Group <AiFillDelete /></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <b>
                                Are you sure...? You want to <span style={{ color: 'red' }} >Delete Group</span>?
                            </b>
                            <br />
                            <b>
                                <span style={{ color: 'red' }} >Note : </span> Only Admin can delete the Group.
                            </b>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteGroup(false)}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={deleteGroup} >Delete</Button>
                        </Modal.Footer>
                    </Modal>
                </div>


            </div>
            <div className="dividing-border-div-top"></div>
        </>
    )
}

export default UserDetailsHeader