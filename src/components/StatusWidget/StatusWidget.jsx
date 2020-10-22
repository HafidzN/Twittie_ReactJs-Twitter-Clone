import React, {useState} from 'react'
// import {useParams} from 'react-router'
import WidgetsTrends from '../WidgetsTrends/WidgetsTrends'
// import WidgetsFollow from '../WidgetsFollow/WidgetsFollow'
import SearchWidget from '../../elements/SearchWidget/SearchWidget'

// import db from '../../firebase'
import '../Widgets/Widgets.css'

const StatusWidget = () => {
//    const {username} = useParams()
//    const [posts, setPosts] = useState([])
   const [text, setText] = useState('')

    return (
        <div className='widgets'>

           <SearchWidget 
               value={text} 
               onChange = {(e)=>setText(e.target.value)}
               onClick={()=>setText('')}           
               placeholder='Search Twittie' 
            />

            <WidgetsTrends />
            
        </div>
    )
}

export default StatusWidget