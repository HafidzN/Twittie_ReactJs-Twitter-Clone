import React from 'react'

const StatusInput = ({type, accept, name, id, htmlFor, Icon, onChange, onClick}) => {
    return (
        <div onClick={onClick}>
            <input type={type} accept={accept} name={name} id={id} style={{display:'none'}} onChange={onChange}/>
            <label htmlFor={id}>
                <Icon />
            </label>                                
        </div>
    )
}

export default StatusInput
