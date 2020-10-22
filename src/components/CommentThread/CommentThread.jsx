import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router'
import ThreadComments from '../ThreadComments/ThreadComments'
import CommentPost from '../CommentPost/CommentPost'
import db from '../../firebase'
import Loader from '../../elements/Loader/Loader'

import '../Feed/Feed.css'
import '../Status/Status.css'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'

const Status = () => {
    const [threadComments, setThreadComments] = useState([])
    const [status, setStatus] = useState(null)
    const [statusUsername, setStatusUsername] = useState('')
    const [originalPost, setOriginalPost] = useState(null)
    const [originalPostUsername, setOriginalPostUsername] = useState('')
    const loading= false
    const history = useHistory()
    const {postId, commentId} = useParams()

    useEffect(() => {
      let mounted = true
      if(postId){
      db.collection('posts').doc(postId).onSnapshot(snapshot=>{
         if(mounted){
            setOriginalPost(snapshot.data())
         }
      })          

      db.collection('posts').doc(postId).collection('comments').doc(commentId)
         .onSnapshot(snapshot=>{
            if(mounted){
               setStatus({...snapshot.data()})
            }
      })

      db.collection('posts').doc(postId).collection('comments').doc(commentId).collection('threadComments')
         .orderBy('timestamp', 'desc')
         .onSnapshot(snapshot=>{
            if(mounted){
               setThreadComments(snapshot.docs.map(comment=>({id:comment.id, ...comment.data()})))
            }
         })
       }

      return () => mounted = false
    }, [postId])

    useEffect(() => {
      let mounted = true
      if (originalPost){
         db.collection('users').doc(originalPost.senderId).onSnapshot(snapshot=>{
            if(mounted){
            setOriginalPostUsername(snapshot.data().username)
            }
         })
      }

      return () => mounted = false
    }, [originalPost])

    useEffect(() => {
      let mounted = true
      if(status){
         db.collection('users').doc(status.senderId).onSnapshot(snapshot=>{
            if(mounted){
               setStatusUsername(snapshot.data().username)
            }
         })
      }

      return () => mounted = false
    }, [status])

    return (
        <div className='feed'>
           <div className="status__header">
              <div className="status__backArrow" onClick={()=>history.goBack()}>
                 <ArrowBackOutlinedIcon />
              </div>
              <h2>Thread</h2>          
           </div>
           
           {status && <CommentPost status={status} comments={threadComments}/>} 

           { loading && <div className="feed__loader"><Loader/></div> }

           <ThreadComments comments={threadComments} statusUsername={statusUsername} originalPostUsername={originalPostUsername} />

        </div>
    )
}

export default Status

