import React from 'react'
import {Link} from 'react-router-dom'
import {Avatar, Button } from '@material-ui/core'
import './UserItemFollow.css'

const UserItemFollow = ({display}) => {
    return (
        <Link to={display ? `/profile/${display.username}` : `/notfound`}>
            <div className="userItemFollow--user__item">
                <Avatar src={display && display.photoURL}/>
                <div className="userItemFollow--user__details">
                    <h2>{display ? display.displayName: 'Empty Room'}</h2>
                    <span>{display && `@${display.username}`}</span>
                </div>
                <Button>Follow</Button>
            </div>        
        </Link>
    )
}

export default UserItemFollow
