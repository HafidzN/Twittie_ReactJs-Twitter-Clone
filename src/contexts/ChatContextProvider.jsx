import React, {createContext, useReducer } from 'react'
import {chatReducer} from './ChatReducers'

export const ChatContext = createContext()

const ChatContextProvider = ({children}) => {
    const [rooms, dispatch] = useReducer(chatReducer, [])

    return (
        <ChatContext.Provider value={{rooms, dispatch}} >
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider
