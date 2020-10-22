import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import CheckIcon from '@material-ui/icons/Check'
import './UserItem.css'

const UserItem = ({name, username, photourl, clicked, onClick}) => {
    return (
        <div className="user__item" onClick={!clicked ?onClick:undefined}>
            <Avatar src={photourl}/>
            <div className="user__details">
               <h2>{name}</h2>
               <span>@{username}</span>
            </div>
            {
                clicked && <CheckIcon />
            }
        </div>
    )
}

export default UserItem
