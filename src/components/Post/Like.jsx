import React, {useEffect, useState} from 'react'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'

import {useStateValue} from '../../contexts/StateContextProvider'
import './FooterIcon.css'

const Like = ({likes, likeAction, unlikeAction}) => {
    const [{user}] = useStateValue()
    const [isLiked, setisLiked] = useState(false)

    useEffect(() => {
        if(user.id && likes){
            if(likes.includes(user.id)){
                setisLiked(true)
            } else {
                setisLiked(false)
            }
        }
    }, [likes])

    return (
        <div className="footerIcon_wrapper">
            { isLiked?
                <span className='liked' onClick={unlikeAction}><FavoriteIcon/></span>
            :
                <FavoriteBorderIcon onClick={likeAction} />
            }
            <div className="footerIcon__counter">{(likes && likes.length>0 )&& likes.length}</div>
        </div>
    )
}

export default Like