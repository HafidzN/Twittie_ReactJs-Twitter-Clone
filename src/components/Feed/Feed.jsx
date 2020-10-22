import React, {useState, useEffect} from 'react'
import TweetBox from '../TweetBox/TweetBox'
import Posts from '../Posts/Posts'
import db from '../../firebase'
import {Avatar} from '@material-ui/core'
import Loader from '../../elements/Loader/Loader'
import './Feed.css'

import {useStateValue} from '../../contexts/StateContextProvider'

const Feed = () => {
    const [{user}] = useStateValue()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(null)
    const [following, setFollowing] = useState([])

    useEffect(() => {
      let mounted = true
      db.collection('users').doc(user.id).onSnapshot(snapshot=>{
         if (mounted) {
            setProfile(snapshot.data())
            setFollowing(snapshot.data() && snapshot.data().following)
         }
      })
      return () => mounted = false
    }, [])

    useEffect(() => {
         let mounted = true
         setLoading(true)
         if(following){
            db.collection('posts')
            .where('senderId', 'in', [user.id,...following])
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot=>{
               if(mounted){
                  if(snapshot.empty){
                     setLoading(false)
                     return
                  }
                     setPosts(snapshot.docs.map(doc=> ({id:doc.id, ...doc.data()})))
                     setLoading(false)
               }
            }, error=>{
               console.log(error)
            })
         } else {
         db.collection('posts')
         .where('senderId', 'in', [user.id])
         .orderBy('timestamp', 'desc')
         .onSnapshot(snapshot=>{
            if(mounted){
               if(snapshot.empty){
                  setLoading(false)
                  return
               }
                  setPosts(snapshot.docs.map(doc=> ({id:doc.id, ...doc.data()})))
                  setLoading(false)
            }
         }, error=>{
            console.log(error)
         }) 
      }

      return () => mounted = false

    }, [following])

    return (
        <div className='feed'>
           <div className="feed__header">
              <div className="feed__header-ava">
                 <Avatar src={profile && profile.photoURL}/>
              </div>
              <h2>Home</h2>          
           </div>
           
           <TweetBox />

           { loading && <div className="feed__loader"><Loader/></div> }

            <Posts posts={posts} />

        </div>
    )
}

export default Feed
