import React, {useState, useEffect, useContext} from 'react'
import { useMediaQuery } from 'react-responsive'
import Modal from '../../elements/Modal/Modal'
import Search from '../../elements/Search/Search'
import SearchUser from '../SearchUser/SearchUser'
import SidebarChatOption from '../SidebarChatOption/SidebarChatOption'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import CloseIcon from '@material-ui/icons/Close'
import './SidebarChat.css'

import db from '../../firebase'
import {useStateValue} from '../../contexts/StateContextProvider'
import {Action} from '../../contexts/ChatReducers' 
import {ChatContext} from '../../contexts/ChatContextProvider'
import {useRoomState} from '../../contexts/IsRoomOpenedContextProvider'

const SidebarChat = () => {
    const [{user}] = useStateValue()
    const [{isRoomOpened}] = useRoomState()
    const {rooms, dispatch} = useContext(ChatContext)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [existingRooms, setExistingRooms] = useState([])
    const [text, setText] = useState('')
    // const isNotFirstSender = e => e=== user.id
    const isMobile = useMediaQuery({ maxWidth: 914 })

    useEffect(() => {
        const unsubscribe = db.collection('rooms').where('members', 'array-contains', user.id).onSnapshot(snapshot => 
            setExistingRooms(snapshot.docs.map((doc)=>{
                // db.collection('rooms').doc(doc.id).collection('messages').get().then(q=> {resolve(q.size)})
                // db.collection('rooms').doc(doc.id).collection('messages').get().then(q=> {
                //     if (q.size && doc.data().members.findIndex(isNotFirstSender) ){
                //         return {
                //                    id: doc.id,
                //                    ...doc.data(),
                //         }
                //     }
                // })  

                return {
                    id: doc.id,
                    ...doc.data(),
                }
                
                }))
            )


        return ()=>unsubscribe()


    }, [user])

    const createNewRoom = () => {
        if (rooms){
            rooms.forEach(room => {
                db.collection('rooms').add({
                    alias: `${user.displayName} ${user.username} ${room.displayName} ${room.username}`,
                    members: [user.id, room.id]
                })
                dispatch({
                  type : Action.REMOVE_ROOM,
                  id   : room.id
                })    
            })
        }
    }

    const dynamicSearch = () => existingRooms.filter(room=>room.alias.toLowerCase().includes(text.toLowerCase()))

    return (
        <>
            <Modal  open={isOpenModal} 
                    onClose={()=>setIsOpenModal(false)}
                    title="New Message"
                    callback = {createNewRoom}
                    Icon = {CloseIcon}
                    ButtonText='Next'
                    >
                    <SearchUser />
            </Modal>

            <>
                <div className={`sidebarChat ${(isRoomOpened && isMobile) && 'noned'}`}>
                    <div className="sidebarChat__header">
                        <h2>Messages</h2> 
                        <div className="sidebarChat__addMessage">
                           <MailOutlineIcon onClick={()=>setIsOpenModal(true)}/>
                        </div>         
                    </div>

                    <Search value={text} 
                            onChange = {(e)=>setText(e.target.value)}
                            onClick={()=>setText('')}
                    />            

                    <div className="sidebarChat__chats">
                    {
                        dynamicSearch().map(room=>(
                          <SidebarChatOption key={room.id}
                            members = {room.members}
                            roomId = {room.id}
                          />
                        ))
                    }
                    </div>            

                </div>
            </>
        </>
    )
}

export default SidebarChat
