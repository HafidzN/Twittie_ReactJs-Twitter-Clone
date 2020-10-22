import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router'
import WidgetsTrends from '../WidgetsTrends/WidgetsTrends'
import WidgetsFollow from '../WidgetsFollow/WidgetsFollow'
import WidgetsPhoto from '../WidgetsPhoto/WidgetsPhoto'
import SearchWidget from '../../elements/SearchWidget/SearchWidget'

import db from '../../firebase'
import '../Widgets/Widgets.css'

const Widgets = () => {
   const {username} = useParams()
   const [posts, setPosts] = useState([])
   const [text, setText] = useState('')
   const [profile, setProfile] = useState(null)

    useEffect(() => {
      db.collection('users').where('username', '==', username).onSnapshot(snapshot=>{
        setProfile(snapshot.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }))[0])
      })
    }, [username])


    useEffect(() => {
        if(profile){
            db.collection('posts')
            .where('senderId', '==', profile.id)
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot=> {
                setPosts(snapshot.docs.map(doc => doc.data()))
            }) 
        }
    }, [profile])


    return (
        <div className='widgets'>

           <SearchWidget 
               value={text} 
               onChange = {(e)=>setText(e.target.value)}
               onClick={()=>setText('')}           
               placeholder='Search Twittie' 
            />

            { posts.length>0 && <WidgetsPhoto posts={posts}/>}

            <WidgetsFollow />

            <WidgetsTrends />
            
        </div>
    )
}

export default Widgets
