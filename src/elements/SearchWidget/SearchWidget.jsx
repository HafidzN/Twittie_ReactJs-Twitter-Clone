import React, {useState} from 'react'
import './SearchWidget.css'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel'

const SearchWidget = ({value, onChange, onClick, placeholder}) => {
    const [focus, setFocus] = useState(false)
    const [isInputPressed, setIsInputPressed] = useState(false)

    const onInputPressed = () => {
        setFocus(true)
        setIsInputPressed(true)
    }

    return (
     <div className="searchWidget__wrapper">
        <div className={`searchWidget ${isInputPressed ?'beingPressed':''}`}>
            <SearchIcon className='searchWidget__searchIcon' />
            <input type="text" 
                    placeholder={placeholder}
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

export default SearchWidget
