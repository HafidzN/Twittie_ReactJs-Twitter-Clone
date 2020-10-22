import React, {useState, useEffect} from 'react'
import './WidgetsPhoto.css'

const WidgetsPhoto = ({posts}) => {
   const [photos, setPhotos] = useState([])

   useEffect(() => {
      setPhotos(posts.filter(post=>post.image.length>0).slice(0,6).map(item=>{return item.image}))
   }, [])

    return (
        <div className='widgets__widgetContainerforPhotos'>
           <div className="wcfpRow">
              <div className="square bcA" style={{backgroundImage: `url(${photos.length>0 && photos[0]})`}}></div>
              <div className="square" style={{backgroundImage: `url(${photos.length>0 && photos[1]})`}}></div>
              <div className="square bcB" style={{backgroundImage: `url(${photos.length>0 && photos[2]})`}}></div>
           </div>
           <div className="wcfpRow"> 
              <div className="square bcD" style={{backgroundImage: `url(${photos.length>0 && photos[3]})`}}></div>
              <div className="square" style={{backgroundImage: `url(${photos.length>0 && photos[4]})`}}></div>
              <div className="square bcC" style={{backgroundImage: `url(${photos.length>0 && photos[5]})`}}></div>
           </div>            
        </div>
    )
}

export default WidgetsPhoto
