import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router'
import Posts from '../Posts/Posts'
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import ProfileTheme from '../ProfileTheme/ProfileTheme'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import Loader from '../../elements/Loader/Loader'

import db from '../../firebase'
// import {useStateValue} from '../../contexts/StateContextProvider'
import '../Feed/Feed.css'

const Feed = () => {
    const {username} = useParams()  
    const history = useHistory()    
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const initProfile={
        bio:'',
        displayName:'', 
        followers:[], 
        following:[], 
        id: '', 
        location: '', 
        photoURL: '', 
        username: '', 
        wallpaper: '', 
        website: ''      
    }
    const [profile, setProfile] = useState(initProfile)

    useEffect(() => {
      db.collection('users').where('username', '==', username).onSnapshot(snapshot=>{
        setProfile(snapshot.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }))[0])
      })
    }, [username])

    useEffect(() => {
      setLoading(true)

      if(profile){
        db.collection('posts')
        .where('senderId', '==', profile.id)
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot=> {
          setPosts(snapshot.docs.map(doc => ({id:doc.id, ...doc.data()})))
          setLoading(false)
        })
      }
    }, [profile])

    const items = [
        {
            id: 0,
            title:'Tweets',
            item: <>
                    { loading && <div className="feed__loader"><Loader/></div> } 
                    <Posts  posts={posts} />
                  </>
        },
        {
            id: 1,
            title: 'Tweets & replies',
            item: <>  { loading && <div className="feed__loader"><Loader/></div> } </>
        },
        {
            id: 2,
            title: 'Media',
            item: <>
                    { loading && <div className="feed__loader"><Loader/></div> } 
                    <Posts  posts={posts.filter(post=>post.image.length>0)} />
                  </>
        },        
        {
            id: 3,
            title: 'Likes',
            item: <> { loading && <div className="feed__loader"><Loader/></div> } </>
        }
    ]

    return (
        <div className='feed'>
           <div className="profile__header">
              <div className="profile__backArrow" onClick={()=>history.goBack()}>
                 <ArrowBackOutlinedIcon />
              </div>
              <div className='profile__title'>
                <div className='profile__title_title'><h2>{profile && profile.displayName}</h2><CheckCircleIcon /></div>        
                <span>{posts && posts.length} tweets</span>
              </div>
           </div>

           <ProfileTheme profile={profile} />

           <TabbarMenu items={items}/>

        </div>
    )
}

export default Feed
