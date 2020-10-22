import React from 'react'
import Modal from 'react-responsive-modal'
import "react-responsive-modal/styles.css"
import {Button } from '@material-ui/core'
import './Modal.css'

const CommonModal = ({ open, 
                       onClose,
                       title,
                       callback,
                       children,
                       Icon,
                       ButtonText
}) => {

    const onClickSave = () => {
        callback()
        onClose()
    }
    return (
        <Modal open={open} onClose={onClose}>
            <div className="modal__header">
                <div className='backIcon'>
                    <Icon onClick={onClose}/>
                </div>
                <h2>{title}</h2>
                {ButtonText.length>0 && <Button onClick={onClickSave}>{ButtonText}</Button> }           
            </div>
            {children}
        </Modal>
    )
}

export default CommonModal
