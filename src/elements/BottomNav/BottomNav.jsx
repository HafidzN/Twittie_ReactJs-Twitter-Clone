import React from 'react'
import {NavLink} from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import MailOutlineIcon from '@material-ui/icons/MailOutline'

import './BottomNav.css'

const BottomNav = () => {
  return (
    <div className="bottomNav">
       <nav>
          <NavLink exact to='/' activeClassName='bottomNav__active'><HomeIcon /></NavLink>
          <NavLink to='/search' activeClassName='bottomNav__active'><PanoramaFishEyeIcon /></NavLink>
          <NavLink to='/notifications' activeClassName='bottomNav__active'><NotificationsNoneIcon /></NavLink>
          <NavLink to='/messages' activeClassName='bottomNav__active'><MailOutlineIcon /></NavLink>
       </nav>
    </div>
  )
}

export default BottomNav
