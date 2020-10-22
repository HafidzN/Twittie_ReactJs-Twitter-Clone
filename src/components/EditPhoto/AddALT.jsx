import React from 'react'
import './AddALT.css'

const AddALT = ({image, altText, setAltText}) => {
    

    return (
        <div className='alt__wrapper'>
            <div className="alt__imageContainer">
                <img src={URL.createObjectURL(image)} alt='addALt'/>
            </div>
            <div className='alt__addDescription'>
                <h2>Description</h2>
                <textarea name="" id="" cols="30" rows="3"
                          value={altText}
                          onChange={e =>setAltText(e.target.value)}
                ></textarea>
            </div>
        </div>
    )
}

export default AddALT
