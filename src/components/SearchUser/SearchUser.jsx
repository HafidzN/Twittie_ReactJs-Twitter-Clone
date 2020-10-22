import React, {useState, useEffect, useContext} from 'react'
import SearchIcon from '@material-ui/icons/Search'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import UserItem from '../UserItem/UserItem'
import UserExist from '../UserItem/UserExist'
import './SearchUser.css'

import db from '../../firebase'

import {Action} from '../../contexts/ChatReducers' 
import {ChatContext} from '../../contexts/ChatContextProvider'
import {useStateValue} from '../../contexts/StateContextProvider'

const SearchUser = () => {
    const [search, setSearch] = useState('')
    const [existingRooms, setExistingRooms] = useState([])
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [{user}] = useStateValue()
    const {rooms, dispatch} = useContext(ChatContext)

    let memberList = []
    let uniqueMemberList = []

    // const [uniqueMemberLists, setUniqueMemberLists] = useState(uniqueMemberList)

    const onClickResult = (user) => {
        dispatch({
            type: Action.ADD_ROOM,
            room: user
        })
    }

    const onChipDelete = (user) => deleteChip(user)

    const deleteChip = (user) => {
        dispatch({
            type: Action.REMOVE_ROOM,
            id : user.id
        })
    }

    useEffect(() => {
        const unsubscribe = db.collection('rooms').where('members', 'array-contains', user.id).onSnapshot(snapshot => 
           setExistingRooms(snapshot.docs.map((doc)=>{
               return {
                   id:doc.id,
                   ...doc.data()
                }
            }))
        )

        return () => {
            unsubscribe()
        }
    }, [])

    existingRooms.map(room=>room.members.forEach(member=> memberList.push(member)))
    memberList.map(member=>{
        return uniqueMemberList.indexOf(member)===-1 && uniqueMemberList.push(member)
    })

    const isClicked = (user) => rooms.some(item => item.id === user.id)
    
    useEffect(() => {
        const unsubscribe = ()=>{
            setLoading(true)
            const res = db.collection('users').where('displayName', '==', search).get().then(result => {
                if (result.empty){
                    setResults([])
                    console.log('LOOOH??!! KOSONGG???!!!')
                    setLoading(false)
                    }
                else {setResults(result.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    // .filter(result=> !existingRooms.members.includes(result.id))
                    )
                    setLoading(false)
                }
            })
            return res
        }

        return ()=> unsubscribe()
    }, [search])

    // useEffect(() => {
    //     existingRooms.map(room=>room.members.forEach(member=> memberList.push(member)))
    //     memberList.map(member=>{
    //         return uniqueMemberList.indexOf(member)===-1 && uniqueMemberList.push(member)
    //     })
    //     setUniqueMemberLists(uniqueMemberList)
    // }, [])

    console.log(memberList)
    console.log(uniqueMemberList)

    return (
        <div className="searchUser">
           <div className='searchUser__header'>
              <div className="searchUser__header-search">
                <SearchIcon /> 
                <input type="text" placeholder='Search People'
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                />              
              </div>

              {
                  rooms.length>0 && <div className="chips">
                    {
                        rooms.map(resUser => {
                            return  <Chip key={resUser.id}
                                            avatar={<Avatar src={resUser.photoURL}/>}
                                            label={resUser.displayName}
                                            onClick={()=>onChipDelete(resUser)}
                                            onDelete={()=>onChipDelete(resUser)}
                                        />
                        })
                    }
                    </div>
              }

           </div>

           { loading &&  <LinearProgress /> }
           
           <div className="users__result">
           {
               results.filter(res=>!uniqueMemberList.includes(res.id)).map(resUser => {
                   return   <UserItem key={resUser.id}
                                      name = {resUser.displayName}
                                      username = {resUser.username}
                                      photourl = {resUser.photoURL}
                                      onClick = {() => onClickResult(resUser)}
                                      clicked = {isClicked(resUser)}            
                   />
               })
           }

            {
                existingRooms.map(room=>{
                    return <UserExist key={room.id}
                            roomId  = {room.id}
                            members = {room.members}      
                    />            
                })
            }

           </div>        

        </div>
    )
}

export default SearchUser
