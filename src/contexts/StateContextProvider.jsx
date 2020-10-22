import React, {createContext, useContext, useReducer} from 'react'
import StateReducers, {initialState} from './StateReducers'

export const StateContext = createContext()

const StateContextProvider = ({children}) => (
    <StateContext.Provider value={useReducer(StateReducers, initialState)}>
       {children}
    </StateContext.Provider>
)

export const useStateValue = () => useContext(StateContext)

export default StateContextProvider