import React from 'react'
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import './UserDetailsSidebar.css'

const UserDetailsSidebar = ({setShowFriendDetail}) => {
    return (
        <div className='user-sidebar-main-div'>
            <div className="return-feture-div">
                <IoIosArrowDropleftCircle onClick={()=>setShowFriendDetail(false)} id='cursor' size={23}/>
            </div>
            <div className="dividing-border-div"></div>
            <div className="friend-profile-wrapper">
                <div className="friend-profile">
                </div>
                <div className="friend-name">
                    Friend's Name
                </div>
            </div>
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
            <div className="dividing-border-div"></div>
            <div className="dummy-div"></div>
        </div>
    )
}

export default UserDetailsSidebar