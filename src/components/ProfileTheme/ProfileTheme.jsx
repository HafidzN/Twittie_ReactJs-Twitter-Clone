import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useParams} from 'react-router'

import CloseIcon from '@material-ui/icons/Close'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import InsertLinkIcon from '@material-ui/icons/InsertLink'
import PlaceIcon from '@material-ui/icons/Place'
import DateRangeIcon from '@material-ui/icons/DateRange'
import MailOutlineIcon from '@material-ui/icons/MailOutline'

import Modal from '../../elements/Modal/Modal'
import ModalImage from '../../elements/Modal/ModalImage'
import Spinner from '../../elements/Spinner/Spinner'
import EditProfile from '../EditProfile/EditProfile'
import FollowingEquality from '../FollowingEquality/FollowingEquality.jsx'

import db from '../../firebase'
import postToCloudinary from '../../helpers/postToCloudinary'
import {useStateValue} from '../../contexts/StateContextProvider'
import {follow, unfollow} from '../../server/serverActions'

import './ProfileTheme.css'

const ProfileTheme = ({posts}) => {
    const [profile, setProfile] = useState({bio:'', displayName:'', followers: [], following:[], location:'', photoURL:'', website:'' })

    const [{user}] = useStateValue()
    const {username} = useParams()

    const [updatedProfileState, setUpdatedProfileState] = useState({})
    const [finalPhoto, setFinalPhoto] = useState(null)
    const [finalWallpaper, setFinalWallpaper] = useState(null)
    const [isPhotoReady, setIsPhotoReady] = useState(false)
    const [isWallpaperReady, setIsWallpaperReady] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const [isOpenModal, setIsOpenModal] = useState(false)
    let isMe = (profile && profile.id) === user.id?true: false

    const [isFollowing, setIsFollowing] = useState(false)

    const [openImage, setOpenImage] = useState(false)
    const [imgsrc, setImgsrc]=useState('')
    const onClickImage = (img) =>{
        setImgsrc(img)
        setOpenImage(true)        
    }
    const handleCloseImage = () => setOpenImage(false)

    useEffect(() => {
      db.collection('users').where('username', '==', username).onSnapshot(snapshot=>{
        setProfile(snapshot.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }))[0])
      })

    }, [username])

    const callbackforModal = () => {
        const {photoToSend, wallpaperToSend} = updatedProfileState.pictureToSend
        setIsUpdating(true)
        if(photoToSend === profile.photoURL){
                setFinalPhoto(profile.photoURL)
                setIsPhotoReady(true)
        }

        if (photoToSend !== profile.photoURL){
            const doFetch = () => postToCloudinary(photoToSend).then(res=> {
                setFinalPhoto(res)
                setIsPhotoReady(true)
            })
            .catch(error=>{ doFetch() } ) 

            doFetch()           
        }

        if (wallpaperToSend === profile.wallpaper){
                setFinalWallpaper(profile.wallpaper)
                setIsWallpaperReady(true)
        }

        if (wallpaperToSend !== profile.wallpaper){
            if (wallpaperToSend === null){
                setFinalWallpaper('')
                setIsWallpaperReady(true)            
            } else {
                const doFetch = () => {
                    postToCloudinary(wallpaperToSend).then(res=> {
                        setFinalWallpaper(res)
                        setIsWallpaperReady(true)
                    })
                    .catch(error=>{ doFetch() } )                      
                }
                doFetch()
            }
        }

    }

    useEffect(() => {
        console.log(`isPhotoReady: ${isPhotoReady}, isWallpaperReady: ${isWallpaperReady}`)
        if(isPhotoReady && isWallpaperReady){
            const {displayName, bio, location, website} = updatedProfileState.profileState
            const doUpdate = () => {
                db.collection('users').doc(user.id).update({
                    displayName,
                    bio,
                    location,
                    website,
                    photoURL: finalPhoto,
                    wallpaper: finalWallpaper
                }).then(res => {
                    setIsUpdating(false)
                })
                .catch(error => { doUpdate()})               
            }
            doUpdate()
        }

    }, [isPhotoReady, isWallpaperReady])


    useEffect(() => {
        if(profile){
            if (!isMe){
                setIsFollowing(profile.followers.includes(user.id))
            }
        }
    }, [profile])


    return (
        <>
            <Modal
                    open={isOpenModal} 
                    onClose={()=>setIsOpenModal(false)}
                    title="Edit Profile"
                    callback = {callbackforModal}
                    Icon = {CloseIcon}
                    ButtonText='Save'
                    >
                    <EditProfile profile={profile} setUpdatedProfileState={setUpdatedProfileState} />        
            </Modal>        

            <ModalImage open={openImage}
                onClose={handleCloseImage}
                imgsrc={imgsrc}
            />

            <div className='userProfile'>
                <div className="userProfile__theme" style={{backgroundImage: `url(${profile && profile.wallpaper})`}} >
                    <div className="photoWrapper" >
                        {(profile && profile.photoURL) && <img src={profile.photoURL} alt={`${profile.displayName}`} onClick={()=>onClickImage(profile.photoURL)} />}
                    </div>
                </div>

                <div className="infoWrapper">
                    <div className="userProfile__actions">
                        <div className="moreWrapper">
                            <MoreHorizIcon />
                        </div>
                        { !isMe && <div className="mailWrapper">
                            <MailOutlineIcon />
                        </div> }                     
                        { isMe? 
                        <div className="followWrapper" onClick={()=>setIsOpenModal(true)}>
                            Edit Profile
                        </div>
                        : 
                            (
                            isFollowing?
                                <div className="followWrapper" onClick={()=>unfollow(user.id, profile.id)}>
                                    Followed
                                </div>
                            :
                                <div className="followWrapper" onClick={()=>follow(user.id, profile.id)}>
                                    Follow
                                </div>                        
                            )              
                        }
                    </div>

                    <h2>{profile&& profile.displayName}</h2>
                    {username && <span>{`@${username}`}</span>}
                    {profile && <p>{profile.bio}</p>}

                    <div className="bioInfo">
                        {(profile && profile.location) && <div> <PlaceIcon /> <span>{profile.location}</span></div>}
                        {(profile && profile.website) && <div className='blued'> <InsertLinkIcon /> <span>{profile.website}</span></div>}
                        <div><DateRangeIcon /> <span>Sep 2020</span></div>
                    </div>

                    <div className="countInfo">
                        <Link to={`/profile/${username}/followinfo`}>
                            <span>{profile && profile.following.length} <p>Following</p></span>
                        </Link>
                        <Link to={`/profile/${username}/followinfo`}>
                            <span>{profile!==undefined && profile.followers.length} <p>Followers</p></span>
                        </Link>

                        { (isMe && isUpdating) && <div className='themeSpinner'> <Spinner /> </div>  }   
                    </div>
                    
                    <div className='themeBottom'>
                        { !isMe && <FollowingEquality profile={profile}/> }
                    </div>
                    
                </div>

            </div>

        </>
    )
}

export default ProfileTheme
