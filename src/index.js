import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import StateContextProvider from './contexts/StateContextProvider'
import IsRoomOpenedContextProvider from './contexts/IsRoomOpenedContextProvider'

ReactDOM.render(
    <StateContextProvider>
        <IsRoomOpenedContextProvider>
            <App/>
        </IsRoomOpenedContextProvider>
    </StateContextProvider>, 
document.querySelector('#root'))