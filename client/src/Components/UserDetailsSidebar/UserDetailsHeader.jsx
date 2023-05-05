import React, { useEffect, useState } from 'react'
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import './UserDetailsSidebar.css'
import './UserDetailsHeader.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



const UserDetailsHeader = ({ setShowFriendDetail }) => {
    const [headerEditDropDown, setHeaderEditDropDown] = useState(false);
    const [showEditChatName, setShowEditChatName] = useState(false);
    const [showEditChatProfile, setShowEditChatProfile] = useState(false);
    const [showEditChatMembers, setShowEditChatMembers] = useState(false);
    const [showExitGroup, setShowExitGroup] = useState(false);
    const [showDeleteGroup, setShowDeleteGroup] = useState(false);


    return (
        <>
            <div className="sidebar-header-feture-div">
                <HiChevronDoubleLeft onClick={() => setShowFriendDetail(false)} id='cursor' size={25} />
                {/* () => { setShowEditChatModel(true); userOfTheSelectedGroup() } */}
                <MdOutlineDriveFileRenameOutline onClick={() => setHeaderEditDropDown(prev => !prev)} className='header-edit-icon' id='cursor' size={25} />
                <div className={headerEditDropDown ? "header-drop-down" : 'none-header'} onMouseLeave={() => setHeaderEditDropDown(false)} >

                    {/****************** EDIT GROUP NAME *********************/}
                    <div className="edit-group-name" onClick={() => { setShowEditChatName(true); setHeaderEditDropDown(false) }} >Edit Group Name</div>
                    <Modal
                        show={showEditChatName}
                        onHide={() => setShowEditChatName(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Edit Group Name</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input type="text" placeholder='Enter chat name...' />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditChatName(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => { }} >Change</Button>
                        </Modal.Footer>
                    </Modal>


                    {/****************** EDIT GROUP PROFILE *********************/}
                    <div className="edit-group-profile" onClick={() => { setShowEditChatProfile(true); setHeaderEditDropDown(false) }} >Edit Group Profile</div>
                    <Modal
                        show={showEditChatProfile}
                        onHide={() => setShowEditChatProfile(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Edit Group Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input type="file" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditChatProfile(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => { }} >Change</Button>
                        </Modal.Footer>
                    </Modal>

                    {/****************** EDIT GROUP MEMBERS *********************/}
                    <div className="edit-group-members" onClick={() => { setShowEditChatMembers(true); setHeaderEditDropDown(false) }} >Edit Group Members</div>
                    <Modal
                        show={showEditChatMembers}
                        onHide={() => setShowEditChatProfile(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Edit Group Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input type="file" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditChatMembers(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => { }} >Change</Button>
                        </Modal.Footer>
                    </Modal>

                    {/****************** EXIT FROM GROUP *********************/}

                    <div className="exit-from-group" onClick={() => { setShowExitGroup(true); setHeaderEditDropDown(false) }} >Exit from Group</div>
                    <Modal
                        show={showExitGroup}
                        onHide={() => setShowExitGroup(false)}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Exit Group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <b>
                                Are you sure...? You want to exit Group?
                            </b>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowExitGroup(false)}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={() => { }} >Exit</Button>
                        </Modal.Footer>
                    </Modal>


                    <div className="deleted-group" onClick={() => { setShowDeleteGroup(true); setHeaderEditDropDown(false) }} >Deleted Group</div>
                    <Modal
                        show={showDeleteGroup}
                        onHide={() => setShowDeleteGroup(false)}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header >
                            <Modal.Title>Exit Group</Modal.Title>
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
                            <Button variant="danger" onClick={() => { }} >Exit</Button>
                        </Modal.Footer>
                    </Modal>
                </div>


            </div>
            <div className="dividing-border-div-top"></div>
        </>
    )
}

export default UserDetailsHeader