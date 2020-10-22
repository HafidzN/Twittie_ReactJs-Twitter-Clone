import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useParams} from 'react-router'
import {useHistory} from 'react-router-dom'

import Popover from '@material-ui/core/Popover'
import FooterIcon from '../Post/FooterIcon'
import Like from '../Post/Like'
import ReplyComment from '../ReplyComment/ReplyComment'
import Modal from '../../elements/Modal/Modal'

import {Avatar} from '@material-ui/core'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import RepeatIcon from '@material-ui/icons/Repeat'
import PublishIcon from '@material-ui/icons/Publish'
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

import {likeComment, unlikeComment, follow, unfollow, deleteComment} from '../../server/serverActions'
import {useStateValue} from '../../contexts/StateContextProvider'
import util from '../../helpers/timeDifference'
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'
import db from '../../firebase'

const CommentPost = ({status, comments}) => {
    const {postId, commentId} = useParams()
    const [{user}] = useStateValue()
    const [originalPost, setOriginalPost] = useState(null)
    const [originalPostSender, setOriginalPostSender] = useState(null)
    const [profile, setProfile] = useState({id:'',displayName:'', photoURL: '', verified: false, username: '', followers:[], following:[]})
    const {displayName, username, photoURL, verified} = profile
    const [ownProfile, setOwnProfile] = useState(null)
    const {
        commentAltText,
        text,
        image,
        timestamp,
        senderId,
        likes
    } = status

   const date = convertTimestampToLocaleString(timestamp)
   const history = useHistory()

   const [isOpenModal, setIsOpenModal] = useState(false)
   const [anchorEl, setAnchorEl] = useState(null)
   const onClickExpand= (event) => setAnchorEl(event.currentTarget)
   const handleClose = () => setAnchorEl(null)
   const open = Boolean(anchorEl)
   const id = open ? 'post-popover' : undefined

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

      db.collection('posts').doc(postId).onSnapshot(snapshot=>{
         if(mounted){
          setOriginalPost(snapshot.data())
         }
      })

      return () => mounted = false

   }, [])

   useEffect(() => {
      let mounted = true
      if (originalPost){
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

   const deleteMyComment = (postId, commentId)=> {
       deleteComment(postId, commentId)
       history.push(`/status/${postId}`)
    }

    const unfollowUser = ()=> unfollow(user.id, senderId)

    const followUser = ()=> follow(user.id, senderId)

    const setIsOpenParentModal = state => setIsOpenModal(state)

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
                  threadAltText: commentAltText,
                  text,
                  image,
                  timestamp,
                  senderId,
                  postId,
                  likes,
                  commentId
               }}
               profile = {profile}
               ownProfile = {ownProfile}
               originalPostSender = {originalPostSender}
               setIsOpenParentModal={setIsOpenParentModal}
            />
         </Modal>

        <div className='statusPost'>
         <div className='post bottomWhited'>
            <div className="post__avatar">
               <Avatar src={photoURL} />
            </div>
            <div className="post__body">
               <div className="post__header">
                  <div className="post__headerText">
                     <div className="post__statusPostHeader">
                        <h3>{displayName} {verified && <VerifiedUserIcon className='post__badge'/>} </h3>                    
                        <span className='post__headerSpecial'> 
                            {username && `@${username} `} 
                        </span> 
                     </div>

                     <div className="post__headerExpandIcon"  aria-describedby={id} variant="contained" onClick={onClickExpand} >
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
                              <li onClick={()=>deleteMyComment(postId, commentId)}>
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
                                    <li onClick={unfollowUser}>
                                       <div><PersonAddDisabledIcon /></div><h3>Unfollow {`@${username}`}</h3>
                                    </li>
                                 :  <li onClick={followUser}>
                                       <div><PersonAddIcon /></div><h3>Follow {`@${username}`}</h3>
                                    </li>
                              }
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
               </div>

            </div>
         </div>

         {originalPostSender && <div className="post__replyingTo addMoreLeftPadd">
           Replying To <Link to={`/profile/${username}`}>{`@${username}`}</Link>  <Link to={`/profile/${originalPostSender.username}`}>{`@${originalPostSender.username}`}</Link>
         </div>}

         <div className='statusPost__body'>
           <div className='statusPost__body--message'>{text}</div>
           { image && <img src={image} alt={commentAltText}/>}
           <div className="statusPost__body--date">{timestamp && util.timeDiff(date)}</div>
         </div>

         <div className="statusPost__footer">
            <div className="post__footer">
                <FooterIcon Icon={ChatBubbleOutlineIcon} value={comments.length} onClick={()=>setIsOpenModal(true)}/>
                <FooterIcon Icon={RepeatIcon} value={0}/>
                <Like likes={likes} 
                      likeAction= {()=>likeComment(postId, commentId, user.id)}
                      unlikeAction = {()=>unlikeComment(postId, commentId,  user.id)}
                />
                <FooterIcon Icon={PublishIcon} value={0}/>
            </div>         
         </div>

        </div>
      </>
    )
}

export default CommentPost