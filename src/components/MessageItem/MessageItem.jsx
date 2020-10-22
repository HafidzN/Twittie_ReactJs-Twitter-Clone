import React, {useState} from 'react'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ModalImage from '../../elements/Modal/ModalImage'

import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'
import {useStateValue} from '../../contexts/StateContextProvider'

const MessageItem = ({msg}) => {
    const [{user}] = useStateValue()
    const [open, setOpen] = useState(false)
    const [imgsrc, setImgsrc]=useState('')
    const {id} = msg
    const {image, message, timestamp, senderId} = msg.data


    const onClickImage = (img) =>{
        setImgsrc(img)
        setOpen(true)        
    }

    const handleClose = () => setOpen(false)

    return <>
        <ModalImage open={open}
               onClose={handleClose}
               imgsrc={imgsrc}
        />
        {
            senderId === user.id ?
                <div className='chat__item ' key={id}>
                    <p className={`chat__message chat__receiver`}>
                        {image && <img src={image} alt="testim" onClick={()=>onClickImage(image)}/>}
                        {message && <span>{message}</span>}
                    </p>
                    <div className="chat__timestamp">{convertTimestampToLocaleString(timestamp)} <DoneAllIcon /></div>
                </div>
            :
                <div className='chat__item' key={id}>
                    <p className={`chat__message`}>
                        {image && <img src={ image} alt="testim" onClick={()=>onClickImage(image)}/>}
                        {message && <span>{message}</span>}
                    </p>
                    <div className="chat__timestamp lefted">{convertTimestampToLocaleString(timestamp)}</div>
                </div>
        }          
    </>
}

export default MessageItem
