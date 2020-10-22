import React, {useState} from 'react'
import WidgetsTrends from '../WidgetsTrends/WidgetsTrends'
import WidgetsFollow from '../WidgetsFollow/WidgetsFollow'
import SearchWidget from '../../elements/SearchWidget/SearchWidget'

import './Widgets.css'

const Widgets = () => {
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
            
            <WidgetsFollow />

        </div>
    )
}

export default Widgets
