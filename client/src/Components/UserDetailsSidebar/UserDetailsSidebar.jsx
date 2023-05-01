import React from 'react'
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import './UserDetailsSidebar.css'

const UserDetailsSidebar = ({setShowFriendDetail , oppositeUser}) => {
    return (
        <div className='user-sidebar-main-div'>
            <div className="return-feture-div">
                <IoIosArrowDropleftCircle onClick={()=>setShowFriendDetail(false)} id='cursor' size={23}/>
            </div>
            <div className="dividing-border-div"></div>
            <div className="friend-profile-wrapper">
                <img src={oppositeUser?.profilePic} className="friend-profile">
                </img>
                <div className="friend-name">
                   {oppositeUser?.name}
                </div>
            </div>
            <div className="dividing-border-div"></div>
            <div className="dummy-div">{` Email : ${oppositeUser?.mail_id}`}</div>
            <div className="dividing-border-div"></div>
            <div className="dummy-div"></div>
            <div className="dividing-border-div"></div>
            <div className="dummy-div"></div>
            <div className="dividing-border-div"></div>
            <div className="dummy-div"></div>
            <div className="dividing-border-div"></div>
            <div className="dummy-div"></div>
            <div className="dividing-border-div"></div>
            <div className="dummy-div"></div>
            <div className="dividing-border-div"></div>
            <div className="dummy-div"></div>
        </div>
    )
}

export default UserDetailsSidebar