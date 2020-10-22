import React from 'react'
import './FooterIcon.css'

const FooterIcon = ({Icon, value, onClick}) => {
    return (
        <div className="footerIcon_wrapper" onClick={onClick}>
            <Icon />
            <div className="footerIcon__counter">{value?value:''}</div>
        </div>
    )
}

export default FooterIcon
