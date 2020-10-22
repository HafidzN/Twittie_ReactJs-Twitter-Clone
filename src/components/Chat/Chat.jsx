import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import firebase from 'firebase'
import {useParams} from 'react-router'
import './Chat.css'
import {Avatar, Button} from '@material-ui/core'

import InfoIcon from '@material-ui/icons/Info'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined'
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined'
import GifOutlinedIcon from '@material-ui/icons/GifOutlined'
import SendIcon from '@material-ui/icons/Send'
import CancelIcon from '@material-ui/icons/Cancel'
import CropIcon from '@material-ui/icons/Crop'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'

import Popover from '@material-ui/core/Popover'
import Picker from 'emoji-picker-react'
import StatusInput from '../StatusInput/StatusInput'
import CropPhoto from '../EditPhoto/CropPhotoB'
import AddALT from '../EditPhoto/AddALT'
import Modal from '../../elements/Modal/Modal'
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import Spinner from '../../elements/Spinner/Spinner'
import MessageItem from '../../components/MessageItem/MessageItem'

import db from '../../firebase'
import postToCloudinary from '../../helpers/postToCloudinary'
import {useStateValue} from '../../contexts/StateContextProvider'
import {generateAltText} from '../../helpers/generateAltText'
import {getInfo} from '../../helpers/getImageDimension'
import {useRoomState} from '../../contexts/IsRoomOpenedContextProvider'
import {actionTypes} from '../../contexts/IsRoomOpenedReducers'

const Chat = () => {
   const {roomId} = useParams()
   const [messages, setMessages] = useState([])
   const [text, setText] = useState('')
   const [members, setMembers] = useState('')
   const [display, setDisplay] = useState({})
   const [{user}] = useStateValue()
   const [{isRoomOpened}, dispatch] = useRoomState()
   const history = useHistory()

   const [altText, setAltText] = useState(generateAltText(user.displayName))
   const [anchorEl, setAnchorEl] = useState(null)
   const [isLoading, setIsloading] = useState(false)


   const [src, setSrc] = useState(null)
   const [imageToSend, setImageToSend] = useState(null)
   const [isOpenModal, setIsOpenModal] = useState(false)
   const [initialImageSize, setinitialImageSize] = useState({width: 0, height: 0})
   const [initialAspectRatio, setinitialAspectRatio] = useState(null)
   const [croppedImageResult, setCroppedImageResult ] = useState(null)


   useEffect(() => {
      if (roomId){
         db.collection('rooms').doc(roomId).onSnapshot(snapshot=>{
            setMembers(snapshot.data() && snapshot.data().members.filter(userId=>userId!==user.id)[0])
         })
      }

      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot=>{
           setMessages(snapshot.docs.map(doc=>({id: doc.id, data: doc.data()})))
      })

      dispatch({
         type: actionTypes.OPENING_ROOM,
         isRoomOpened: true    
      })      

      if(isRoomOpened){}

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

   const sendMessage = (e) => {
      e.preventDefault()
      setIsloading(true)

        if(imageToSend){
            postToCloudinary(imageToSend)
            .then( res=>{

               db.collection('rooms')
                .doc(roomId)
                .collection('messages')
                .add({
                     senderId: user.id,
                     message: text,
                     image : res,
                     timestamp: firebase.firestore.FieldValue.serverTimestamp()
               })
               setText('')
               setSrc(null)
               setImageToSend(null)
               setIsloading(false)
            })
            .catch( err=> {
               setIsloading(false)
                return
            })
        } else {
            db.collection('rooms')
             .doc(roomId)
             .collection('messages')
             .add({
               senderId: user.id,
               message: text,
               timestamp: firebase.firestore.FieldValue.serverTimestamp()
              })
            setText('')
            setSrc(null)
            setIsloading(false)
         }
      }

    const onSelectFile = e => {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            setSrc(fileReader.result)
            setImageToSend(fileReader.result)
        }   
        fileReader.readAsDataURL(e.target.files[0])

        getInfo(e).then(res=> {
            setinitialImageSize({width: res.width, height: res.height})
        })
    }


    useEffect(() => {
        setinitialAspectRatio(initialImageSize.width/initialImageSize.height)
    }, [initialImageSize])

    const changeSrc = () => {
        setSrc(URL.createObjectURL(croppedImageResult))
        setImageToSend(croppedImageResult)
    }

    const callbackforModal = () =>{
        changeSrc()
        if (altText.length === 0){
            setAltText(generateAltText(user.displayName))
        }
    }


    const items = [
        {
            id: 0,
            title:'',
            icon: <CropIcon />,
            item: <CropPhoto 
                    image={src} 
                    setCroppedImageResult ={setCroppedImageResult} 
                    initialAspectRatio    = {initialAspectRatio}
            />
        },
        {
            id: 1,
            title: 'ALT',
            icon: '',
            item: <AddALT image={croppedImageResult} altText={altText} setAltText={setAltText}/>
        }
    ]

    const open = Boolean(anchorEl)
    const id = open ? 'post-popover' : undefined
    const onClickEmoticon = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const onEmojiClick = (event, emojiObject) => {
        let newMessage = text + emojiObject.emoji
        setText(newMessage)
    }


    const closeRoom = () => {
         dispatch({
            type: actionTypes.CLOSING_ROOM,
         })  

         history.push('/messages')     
    }

    return (
      <>
            <Modal  open={isOpenModal} 
                    onClose={()=>setIsOpenModal(false)}
                    title="Edit Photo"
                    callback = {callbackforModal}
                    Icon = {ArrowBackOutlinedIcon}
                    ButtonText='Save'
                    >
                    <TabbarMenu items={items}/>
            </Modal>

        <div className="chat">
           <div className="chat__header">
              <div className="chat__backArrow">
                 <ArrowBackOutlinedIcon  onClick={closeRoom}/>
              </div>
              <div className="chat__header-ava">
                 <Avatar src={display && display.photoURL}/>
               </div>
              <h2>{display && display.displayName}</h2>
              <Link to={`/messages/${roomId}/info`}><InfoIcon member={display}/></Link>      
           </div>

            <div className="chat__body">
               {
                  messages.map(msg=>{
                      return <MessageItem key={msg.id} msg={msg} />
                  })
               }
            </div>

            <div className="chat__footer">
               { src && 
               <div className='chat__footer-ImageBox'>
                  <CancelIcon className='cancelIcon' onClick={()=>setSrc(null)}/>
                  <img src={src} alt="new test"/>               
                  <Button className='editImage' onClick={()=>setIsOpenModal(true)}>Edit</Button>
               </div>
               }

               <StatusInput Icon={InsertPhotoOutlinedIcon}
                           type="file"
                           accept="image/*"
                           name="image-upload"
                           id="input-image"
                           onChange={onSelectFile}
               />
               <GifOutlinedIcon />
               <form onSubmit={sendMessage}>
                  <input type="text"
                     placeholder='Start a new message'
                     value={text}
                     onChange ={(e)=>setText(e.target.value)}
                  />
                  <div className="chat__footer-emowrapper">
                    <SentimentSatisfiedOutlinedIcon aria-describedby={id} type="button" onClick={onClickEmoticon} />
                     <Popover 
                           id={id}
                           open={open}
                           anchorEl={anchorEl}
                           onClose={handleClose}
                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                           }}
                           transformOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                           }}
                           style={{
                              transform: 'translate(-2rem, -1rem)'
                           }}

                     >
                           <Picker onEmojiClick={onEmojiClick} />
                     </Popover>

                  </div>
                  {
                     (src || text.length>0)?
                     isLoading?
                     <span className='spinnerSpan'><Spinner /></span>
                     :<SendIcon type='submit' className='readyBtn' onClick={sendMessage}/>
                     :<SendIcon /> 
                  }
               </form>

            </div>

        </div>
      </>
    )
}

export default Chat