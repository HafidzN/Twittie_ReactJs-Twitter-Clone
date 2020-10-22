import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router'
import Comments from '../Comments/Comments'
import StatusPost from '../StatusPost/StatusPost'
import db from '../../firebase'
import Loader from '../../elements/Loader/Loader'

import '../Feed/Feed.css'
import './Status.css'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'

const Status = () => {
    const [comments, setComments] = useState([])
    const [status, setStatus] = useState(null)
    const [statusUsername, setStatusUsername] = useState('')
    const loading= false
    const history = useHistory()
    const {postId} = useParams()

    useEffect(() => {
      let mounted = true
      if(postId){
      db.collection('posts').doc(postId)
         .onSnapshot(snapshot=>{
            if(mounted){
               setStatus({...snapshot.data()})
            }
      })

      db.collection('posts').doc(postId).collection('comments')
         .orderBy('timestamp', 'desc')
         .onSnapshot(snapshot=>{
            if(mounted){
               setComments(snapshot.docs.map(comment=>({id:comment.id, ...comment.data()})))
            }
         })
      }

      return () => mounted = false

    }, [postId])

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
              <h2>Tweet</h2>          
           </div>
           
           {status && <StatusPost status={status} comments={comments}/>} 

           { loading && <div className="feed__loader"><Loader/></div> }

           <Comments comments={comments} statusUsername={statusUsername} />

        </div>
    )
}

export default Status
