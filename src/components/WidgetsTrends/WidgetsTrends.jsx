import React, {useState} from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Popover from '@material-ui/core/Popover'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'

import './WidgetsTrends.css'

const WidgetTrends = () => {
   const [anchorEl, setAnchorEl] = useState(null)
   const onClickExpand= (event) => setAnchorEl(event.currentTarget)
   const handleClose = () => setAnchorEl(null)
   const open = Boolean(anchorEl)
   const id = open ? 'post-popover' : undefined

    return (

           <div className="widgets__widgetContainer">
              <h2>What's happening</h2>

              <ul className='widgets__trendsContainer'>
                 <li>
                    <div className='popular'>
                       <span>Popular in Indonesia</span>         
                       <ExpandMoreIcon aria-describedby={id} variant="contained" onClick={onClickExpand } />
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
                              <li>
                                 <div ><SentimentVeryDissatisfiedIcon /></div><h3 >This trend is spam</h3>
                              </li>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>This trend is abusive or harmfull</h3>
                              </li>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>This trend is a duplicate</h3>
                              </li>
                              <li>
                                 <div><SentimentVeryDissatisfiedIcon /></div><h3>This trend is low quality</h3>
                              </li>
                           </ul>
                        </Popover>

                    </div>
                    <div className='hashtag'>Toklenpedia</div>
                    <div className='tweetNumber'>5012 Tweets</div>
                 </li>
                 <li>
                    <div className='popular'>
                       <span>Popular in Indonesia</span>         
                       <ExpandMoreIcon />
                    </div>
                    <div className='hashtag'>Bukanbapak Sale</div>
                    <div className='tweetNumber'>4099 Tweets</div>
                 </li>
                 <li>
                    <div className='popular'>
                       <span>Popular in Indonesia</span>         
                       <ExpandMoreIcon />
                    </div>
                    <div className='hashtag'>FIFAWorldCupU20</div>
                    <div className='tweetNumber'>4022 Tweets</div>
                 </li>
                 <li>
                    <div className='popular'>
                       <span>Popular in Indonesia</span>         
                       <ExpandMoreIcon />
                    </div>
                    <div className='hashtag'>MotoGPMandalika</div>
                    <div className='tweetNumber'>3088 Tweets</div>
                 </li>
              </ul>


           </div>


    )
}

export default WidgetTrends
