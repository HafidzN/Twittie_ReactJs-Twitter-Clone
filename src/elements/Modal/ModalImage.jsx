import React from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
    }
}))

const ModalImage = ({open, onClose, imgsrc}) => {
    const classes = useStyles()

    return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
           <div className='modalImage__imageWrapper'>
              <img src={imgsrc} alt="popupimge" 
              // className={`${rounded && 'rounded'}`}
              />
           </div>
        </Fade>
      </Modal>
    )
}

export default ModalImage
