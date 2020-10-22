import React, {useState,useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import {Avatar} from '@material-ui/core'
import './SidebarChatOption.css'
import db from '../../firebase'
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'
import util from '../../helpers/lastMessageTime'
import {useStateValue} from '../../contexts/StateContextProvider'

const SidebarChatOption = ({name, roomId, members}) => {
    const [{user}] = useStateValue()
    const [messages, setMessages] = useState([])
    const [contact, setContact] = useState(null)
    const [opp, setOpp] = useState('')

    useEffect(() => {
        let mounted = true
        if(roomId){
            db.collection('rooms')
              .doc(roomId)
              .collection('messages')
              .orderBy('timestamp', 'desc')
              .onSnapshot(snapshot=>{
                if(mounted){
                    setMessages(snapshot.docs.map(doc=>doc.data()))
                }
            })    
        }

        return () => mounted = false
    }, [])


    useEffect(() => {
        let mounted = true
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot(snapshot=>{
                if(mounted){
                    setOpp(snapshot.data().members.filter(userId=>userId!==user.id)[0])
                }
            })
        }

        return () => mounted = false
    }, [roomId])


    useEffect(() => {
        let mounted = true
        if(opp){
            db.collection('users')
            .doc(opp)
            .onSnapshot(snapshot=>{
                if(mounted){
                    setContact(snapshot.data())
                }
            })
        }

        return () => mounted = false
    }, [opp])


    const interpretDate = (time) =>{
        if(time){
            const date = convertTimestampToLocaleString(time)
            return util.lastMessageTime(date)
        }
    }
      
    return (
        <NavLink to={`/messages/${roomId && roomId}`} className={`sidebarChatOption`} activeClassName='active_chat' >
            <Avatar src={contact? contact.photoURL: null} />
            <div className="sidebarChatOption__info">
                <h2> {contact ? contact.displayName: 'Empty Room'}
                <span>{contact ? `@${contact.username}`: ''}</span> 
                </h2>
                <p>{messages[0] && (messages[0].message.length>25?`${messages[0].message.slice(0,24)} ...`:messages[0].message)}</p>
            </div>
            <div className="sidebarChatOption__date">{messages[0] && interpretDate(messages[0].timestamp)}</div>
        </NavLink>  
    )          
}

export default SidebarChatOption