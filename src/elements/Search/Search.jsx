import React, {useState} from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import './Search.css'

const Search = ({value, onChange, onClick}) => {
    const [focus, setFocus] = useState(false)
    const [isInputPressed, setIsInputPressed] = useState(false)

    const onInputPressed = () => {
        setFocus(true)
        setIsInputPressed(true)
    }

    return (
        <div className="commonSearch__search">
            <div className={`commonSearch__searchContainer ${isInputPressed && 'pressed'}`}>
                <SearchOutlinedIcon />
                <input type="text" 
                    className={`commonSearch__input ${isInputPressed && 'inputPressed'}`}
                    placeholder='Search for people and group'
                    onFocus = {onInputPressed}
                    onBlur = {()=> setIsInputPressed(false)}
                    value = {value}
                    onChange = {onChange}
                />

                { (focus && value.length>0) && <CancelIcon onClick={onClick} /> }
            
            </div>
        </div>
    )
}

export default Search
