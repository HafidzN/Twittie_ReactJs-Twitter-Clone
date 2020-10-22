import React, {useState, useEffect} from 'react'
import {Avatar} from '@material-ui/core'

import db from '../../firebase'
import {useStateValue} from '../../contexts/StateContextProvider'

const FollowingEquality = ({profile}) => {
    const [{user}] = useStateValue()
    const [myFollowing, setMyFollowing] = useState([])
    const [equality, setEquality] = useState([])

    const [user1, setUser1] = useState(null)
    const [user2, setUser2] = useState(null)

    useEffect(() => {
        db.collection('users').doc(user.id).onSnapshot(snapshot=>{
            if(snapshot.empty){
                return
            }
            setMyFollowing(snapshot.data() && snapshot.data().following)
        })
    }, [])

    useEffect(() => {
        if(profile&& profile.followers.length>0){
            setEquality(profile.followers.filter(item=> myFollowing.includes(item)))   
        }
    }, [myFollowing, profile])   

    useEffect(() => {
        let equalityLength = equality.length
        if(equalityLength>0){
            if (equalityLength>1){
                db.collection('users').doc(equality[1]).onSnapshot(snapshot=>{
                    setUser2(snapshot.data())
                })
            }

            db.collection('users').doc(equality[0]).onSnapshot(snapshot=>{
                setUser1(snapshot.data())
            })

        }
    }, [equality])

    console.log(equality)

    return (
        <div className="followedInfo">
            {
                equality.length>0 ?
                <>
                    {user1 && <Avatar src={user1.photoURL}/>}
                    {(equality.length>1 && user2 ) && <Avatar src={user2.photoURL}/>}
                    <span>Followed by {`${user1 ? user1.displayName: ''} `} {(equality.length===2 && user2) ? `and ${user2.displayName}`: ''} {(equality.length>2 && user2)?`, ${user2.displayName}, and ${equality.length-2} others`:''} </span>
                </>
                :
                <span>Not followed by anyone you follow</span>      
            }
        </div>
    )
}

export default FollowingEquality
