import React, {useEffect, useState} from 'react'
import Avatar from '@material-ui/core/Avatar'
import CheckIcon from '@material-ui/icons/Check'
import db from '../../firebase'
import './UserItem.css'
import {useStateValue} from '../../contexts/StateContextProvider'

const UserExist = ({roomId, members, clicked}) => {
    const [{user}] = useStateValue()
    const [opp, setOpp] = useState('')
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        setOpp(members.filter(member=>member!==user.id).toString())
    }, [])

    useEffect(() => {
        if(opp.length>0){
            db.collection('users').doc(opp).onSnapshot(snapshot=>{                
                setUserInfo(snapshot.data())
            })
        }             
    }, [opp])

    return (
        <div className="user__item nocursor" >
            <Avatar src={userInfo && userInfo.photoURL}/>
            <div className="user__details">
               <h2>{userInfo && userInfo.displayName}</h2>
               <span>{userInfo && `@${userInfo.username}`}</span>
            </div>
            <CheckIcon />
        </div>

    )
}

export default UserExist
