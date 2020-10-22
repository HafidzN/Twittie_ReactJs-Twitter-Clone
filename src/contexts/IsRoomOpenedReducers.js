export const initialState = {
    isRoomOpened: null
}

export const actionTypes = {
    OPENING_ROOM: 'OPENING_ROOM',
    CLOSING_ROOM: 'CLOSING_ROOM'
}

const isRoomOpenededucer = (state, action) => {
    switch (action.type) {
        case actionTypes.OPENING_ROOM:
            return {
                isRoomOpened: true
            }
        
        case actionTypes.CLOSING_ROOM:
            return {
                isRoomOpened: false
            }

        default:
            return state
    }
}

export default isRoomOpenededucer