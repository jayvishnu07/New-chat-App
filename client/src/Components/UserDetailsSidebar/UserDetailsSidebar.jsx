import React from 'react'
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import './UserDetailsSidebar.css'

const UserDetailsSidebar = ({ setShowFriendDetail, chatInfo }) => {
    return (
        <div className='user-sidebar-main-div'>
            <div className="return-feture-div">
                <IoIosArrowDropleftCircle onClick={() => setShowFriendDetail(false)} id='cursor' size={23} />
            </div>
            <div className="dividing-border-div"></div>
            <div className="friend-profile-wrapper">
                <img src={!chatInfo.isGroupChat ? chatInfo.profilePic : chatInfo.groupProfile} className="friend-profile">
                </img>
                <div className="friend-name">
                    {chatInfo?.name}
                </div>
            </div>
            <div className="dividing-border-div"></div>
            <div className="email-div-or-participants-title">{!chatInfo.isGroupChat ? ` Email : ${chatInfo?.mail_id}` :' Group Participants ~'}</div>
            {
                chatInfo.isGroupChat &&
                chatInfo.users.map((res, key) => {
                    return (
                        <div key={key} id='cursor' className='friends-list-wrapper'>
                            <div className="friends-list-item-bottom-border"></div>
                            <div className="new-friends-list-item-wrapper-main"  >
                                <img id='cursor' src={res.profilePic} className='new-friends-list-profile' alt="proflie" />
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
        </div>
    )
}

export default UserDetailsSidebar