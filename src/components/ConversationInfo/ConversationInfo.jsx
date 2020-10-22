import React, {useEffect, useState} from 'react'
import firebase from 'firebase'
import UserItemFollow from '../UserItem/UserItemFollow'
import {useHistory} from 'react-router-dom'
import {useParams} from 'react-router'
import Switch from '@material-ui/core/Switch'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import './ConversationInfo.css'
import db from '../../firebase'
import {useStateValue} from '../../contexts/StateContextProvider'

import {useRoomState} from '../../contexts/IsRoomOpenedContextProvider'
import {actionTypes} from '../../contexts/IsRoomOpenedReducers'

const ConversationInfo = () => {
    const history = useHistory()
    const {roomId} = useParams()
    const [{user}] = useStateValue()
    const [{isRoomOpened}, dispatch] = useRoomState()
    const [state, setState] = useState({ checkedB: false})

    const [members, setMembers] = useState('')
    const [display, setDisplay] = useState({})

    const handleChange = (event) => {setState({ ...state, [event.target.name]: event.target.checked })}

    useEffect(() => {
      if (roomId){
         db.collection('rooms').doc(roomId).onSnapshot(snapshot=>{
            setMembers(snapshot.data() && snapshot.data().members.filter(userId=>userId!==user.id)[0])
         })

         dispatch({
            type: actionTypes.OPENING_ROOM,  
         })

         if(isRoomOpened){}
      }
    }, [roomId])

    useEffect(() => {
      if(members){
         db.collection('users')
         .doc(members)
         .onSnapshot(snapshot=>{
            setDisplay(snapshot.data())
         })
      }
    }, [members])

    const leaveConversation = () => {
      if (roomId){
         let ref = db.collection('rooms').doc(roomId)
         ref.update({
            members: firebase.firestore.FieldValue.arrayRemove(user.id)
         }).then(res=> history.push('/messages'))
      }
    }


    return (
        <div className="conversationInfo">
           <div className="conversationInfo__header">
             <div className="conversationInfo__header--back">
                <ArrowBackOutlinedIcon onClick={()=>history.goBack()}/>
             </div>
              <h2>Conversation Info</h2>     
           </div>

           <UserItemFollow display={display}/>

            <div className="notifications">
               <h2>Notifications</h2>
               <div className='mute'>
                  <p>Mute conversation</p>
                   <Switch
                       checked={state.checkedB}
                       onChange={handleChange}
                       color="primary"
                       name="checkedB"
                       inputProps={{ 'aria-label': 'primary checkbox' }}
                   />
               </div>
            </div>

            <ul className="userActions">
               <li>{`Block @${display && display.username}`}</li>
               <li>{`Report @${display && display.username}`}</li>
               <li className='red' onClick={leaveConversation}>Leave Conversation</li>
            </ul>

        </div>
    )
}

export default ConversationInfo
