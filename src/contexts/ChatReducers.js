export const Action = {
    ADD_ROOM: 'add_room',
    REMOVE_ROOM: 'remove_room',
    EMPTY_ROOM: 'empty_room',
}

export const chatReducer = (state, action) => {
    switch (action.type) {
        case Action.ADD_ROOM: {
            return [...state, action.room]
        }

        case Action.REMOVE_ROOM: {
            return state.filter(user => user.id !== action.id)
        }

        case Action.EMPTY_ROOM:{
            return []
        }

        default:
            return state
    }
} 