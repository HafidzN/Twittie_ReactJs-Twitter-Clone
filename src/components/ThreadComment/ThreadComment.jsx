import React, {useState, forwardRef, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Avatar} from '@material-ui/core'
import {useParams} from 'react-router'

import Popover from '@material-ui/core/Popover'
import util from '../../helpers/timeDifference'
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'

import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import BarChartIcon from '@material-ui/icons/BarChart'
import CodeIcon from '@material-ui/icons/Code'
import PlaceIcon from '@material-ui/icons/Place'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import BlockIcon from '@material-ui/icons/Block'
import PostAddIcon from '@material-ui/icons/PostAdd'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'


import '../Post/Post.css'
import db from '../../firebase'
import {useStateValue} from '../../contexts/StateContextProvider'
import {unfollow, deleteThreadComment} from '../../server/serverActions'

const ThreadComment = forwardRef(({
   commentAltText,
   text,
   image,
   timestamp,
   senderId,
   threadCommentId,
   likes,
   statusUsername,
   originalPostUsername
   }, ref) => {

   const {postId, commentId} = useParams()
   const date = convertTimestampToLocaleString(timestamp)

   const [anchorEl, setAnchorEl] = useState(null)
   const onClickExpand= (event) => setAnchorEl(event.currentTarget)
   const handleClose = () => setAnchorEl(null)
   const open = Boolean(anchorEl)
   const id = open ? 'post-popover' : undefined

   const [{user}] = useStateValue()
   const [profile, setProfile] = useState({id:'',displayName:'', photoURL: '', verified: false, username: ''})
   const {displayName, username, photoURL, verified} = profile

   useEffect(() => {
      db.collection('users').doc(senderId).onSnapshot(snapshot=>{
         setProfile(snapshot.data())
      })
   }, [])

   const deleteMyThreadComment = (postId, commentId, threadCommentId) => {
       deleteThreadComment(postId, commentId, threadCommentId)
   }

   return (
      <>
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
                              <li onClick={()=>deleteMyThreadComment(postId, commentId, threadCommentId)}>
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
                              <li onClick={()=>unfollow(user.id, senderId)}>
                                 <div><PersonAddDisabledIcon /></div><h3>Unfollow {`@${username}`}</h3>
                              </li>
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
                     Replying To 
                     <Link to={`/profile/${statusUsername}`}>{`@${statusUsername} `}</Link>
                     <Link to={`/profile/${originalPostUsername}`}>{`@${originalPostUsername}`}</Link>
                  </div>}

                  <div className="post__headerDescription">
                     <p> {text} </p>
                  </div>
               </div>

               { image.length>0 && <img src={image} alt={commentAltText} />}

            </div>

         </div>
      </>
   )
  }
)

export default ThreadComment
