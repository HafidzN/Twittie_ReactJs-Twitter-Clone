import React, {useState, forwardRef, useEffect} from 'react'
import {Avatar} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {useHistory, useParams} from 'react-router'

import FooterIcon from '../Post/FooterIcon'
import ReplyComment from '../ReplyComment/ReplyComment'
import Like from '../Post/Like'
import Popover from '@material-ui/core/Popover'
import Modal from '../../elements/Modal/Modal'
import util from '../../helpers/timeDifference'
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'

import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import RepeatIcon from '@material-ui/icons/Repeat'
import PublishIcon from '@material-ui/icons/Publish'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import BarChartIcon from '@material-ui/icons/BarChart'
import CodeIcon from '@material-ui/icons/Code'
import PlaceIcon from '@material-ui/icons/Place'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import BlockIcon from '@material-ui/icons/Block'
import PostAddIcon from '@material-ui/icons/PostAdd'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import CloseIcon from '@material-ui/icons/Close'

import '../Post/Post.css'
import db from '../../firebase'
import {useStateValue} from '../../contexts/StateContextProvider'
import {likeComment, unlikeComment, follow, unfollow, deleteComment} from '../../server/serverActions'

const Comment = forwardRef(({
   commentAltText,
   text,
   image,
   timestamp,
   senderId,
   commentId,
   likes,
   statusUsername
   }, ref) => {

   const history = useHistory()
   const {postId} = useParams()
   const date = convertTimestampToLocaleString(timestamp)

   const [anchorEl, setAnchorEl] = useState(null)
   const onClickExpand= (event) => setAnchorEl(event.currentTarget)
   const handleClose = () => setAnchorEl(null)
   const open = Boolean(anchorEl)
   const id = open ? 'post-popover' : undefined

   const [{user}] = useStateValue()
   const [profile, setProfile] = useState({id:'',displayName:'', photoURL: '', verified: false, username: '', followers: [], following:[]})
   const {displayName, username, photoURL, verified} = profile
   const [ownProfile, setOwnProfile] = useState(null)
   const [originalPost, setOriginalPost] = useState(null)
   const [originalPostSender, setOriginalPostSender] = useState(null)
   
   const [isOpenModal, setIsOpenModal] = useState(false)
   const setIsOpenParentModal = state => setIsOpenModal(state)

   const [threadComments, setThreadComments] = useState([])
   const redirectToThread = commentId => history.push(`/status/${postId}/${commentId}`)

   const [isFollowing, setIsFollowing] = useState(false)

   useEffect(() => {
      let mounted = true
      db.collection('users').doc(user.id).onSnapshot(snapshot=>{
         if(mounted){
            setOwnProfile({id:user.id, ...snapshot.data()})
         }
      })

      db.collection('users').doc(senderId).onSnapshot(snapshot=>{
         if(mounted){
            setProfile(snapshot.data())
         }
      })

      db.collection('posts').doc(postId).collection('comments')
         .doc(commentId).collection('threadComments')
         .onSnapshot(snapshot=>{
            if(mounted){
               setThreadComments(snapshot.docs.map(threadComment=>({id:threadComment.id, ...threadComment.data()})))
            }
      })

      db.collection('posts').doc(postId).onSnapshot(snapshot=>{
         if(mounted){
            setOriginalPost(snapshot.data())
         }
      })      

      return () => mounted = false
   }, [])

   useEffect(() => {
      let mounted = true

      if(originalPost){
         db.collection('users').doc(originalPost.senderId).onSnapshot(snapshot=>{
            if(mounted){
               setOriginalPostSender(snapshot.data())
            }
         })
      }

      return () => mounted = false

   }, [originalPost])

   useEffect(() => {
      if(profile){
         setIsFollowing(profile.followers.includes(user.id))
      }
   }, [profile])

   const callbackForModal = () => {}

   return (
      <>
         <Modal  
            open={isOpenModal} 
            onClose={()=>setIsOpenModal(false)}
            title=""
            callback = {callbackForModal}
            Icon = {CloseIcon}
            ButtonText=''
         >
            <ReplyComment props={{
                  threadAlttext: commentAltText,
                  image,
                  timestamp,
                  senderId,
                  commentId,
                  likes
               }}
               profile={profile}
               ownProfile ={ownProfile}
               setIsOpenParentModal = {setIsOpenParentModal}
               originalPostSender = {originalPostSender}
            />
         </Modal>

         <div className='post' ref={ref}>
            <div className="post__avatar">
               <Avatar src={photoURL} />
            </div>
            <div className="post__body">
               <div className="post__header">
                  <div className="post__headerText">
                     <h3>{displayName} {' '}
                        <span className='post__headerSpecial'> 
                              {verified && <VerifiedUserIcon className='post__badge'/>} 
                              @{`${username} . ${timestamp && util.timeDiff(date)}`}
                        </span>
                     </h3>
                     <div className="post__headerExpandIcon" aria-describedby={id} variant="contained" onClick={onClickExpand } >
                        <ExpandMoreIcon />
                     </div>

                     <Popover 
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}

                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                     >
                        <ul className="post__expandList">
                        {
                           senderId === user.id?
                           <>
                              <li onClick={()=>deleteComment(postId, commentId)}>
                                 <div className='delete'><DeleteOutlineIcon /></div><h3 className="delete">Delete</h3>
                              </li>
                              <li>
                                 <div><PlaceIcon /></div><h3>Pin to your profile</h3>
                              </li>
                              <li>
                                 <div><CodeIcon /></div><h3>Embed Tweet</h3>
                              </li>
                              <li>
                                 <div><BarChartIcon /></div><h3>View Tweet activity</h3>
                              </li>
                           </>
                           :
                           <>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>Not interested in this tweet</h3>
                              </li>
                              {
                                 isFollowing?
                                 <li onClick={()=>unfollow(user.id, senderId)}>
                                    <div><PersonAddDisabledIcon /></div><h3>Unfollow {`@${username}`}</h3>
                                 </li>
                                 : <li onClick={()=>follow(user.id, senderId)}>
                                    <div><PersonAddIcon /></div><h3>Follow {`@${username}`}</h3>
                                 </li>


                              }
                              {/* <li onClick={()=>unfollow(user.id, senderId)}>
                                 <div><PersonAddDisabledIcon /></div><h3>Unfollow {`@${username}`}</h3>
                              </li> */}
                              <li>
                                 <div><PostAddIcon /></div><h3>Add/remove from Lists</h3>
                              </li>
                              <li>
                                 <div><BlockIcon /></div><h3>Block {`@${username}`}</h3>
                              </li>
                              <li>
                                 <div><CodeIcon /></div><h3>Embed Tweet</h3>
                              </li>
                           </>
                        }
                        </ul>
                     </Popover>
                  </div>

                  {statusUsername && <div className="post__replyingTo">
                     Replying To <Link to ={`/profile/${statusUsername}`}>{`@${statusUsername}`}</Link>
                  </div>}

                  <div className="post__headerDescription" onClick={()=>redirectToThread(commentId)}>
                     <p> {text} </p>
                  </div>
               </div>

               { image.length>0 && <img src={image} alt={commentAltText} onClick={()=>redirectToThread(commentId)} />}

               <div className="post__footer">
                  <FooterIcon Icon={ChatBubbleOutlineIcon} value={threadComments.length} onClick={()=>setIsOpenModal(true)}/>
                  <FooterIcon Icon={RepeatIcon} value={0}/>
                  <Like 
                     likes={likes} 
                     likeAction = {()=>likeComment(postId, commentId, user.id)}
                     unlikeAction = {()=> unlikeComment(postId, commentId, user.id)}
                  />
                  <FooterIcon Icon={PublishIcon} value={0}/>
               </div>
            </div>

         </div>
      </>
   )
  }
)

export default Comment
