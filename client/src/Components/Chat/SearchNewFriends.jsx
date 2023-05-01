import React from 'react'
import './Chats.css'

const SearchNewFriends = ({newFriends, accessChat}) => {
    return (
        <>
            {
                newFriends.map((newFriend, key) => {
                    return (
                        <div key={key} >
                            <div className="new-friends-list-item-bottom-border"></div>
                            <div className="new-friends-list-item-wrapper" id='cursor' onClick={() => accessChat(newFriend._id)}>
                                <img id='cursor' src={newFriend.profilePic} className='new-friends-list-profile' alt="proflie" />
                                <div className="new-friends-list-item">
                                    {newFriend.name}
                                    <br />
                                    {`latest message`}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <div className="new-friends-list-item-bottom-border"></div>
        </>
    )
}

export default SearchNewFriends