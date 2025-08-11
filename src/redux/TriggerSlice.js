import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    showNotificationBox: false,
    showInviteFriendBox: false,
    showProfileBox: false,
    isEffect: false,
    isBoxVisible: false,
    currentListId: null
}

export const TriggerSlice = createSlice({
    name: 'trigger',
    initialState,
    reducers: {
        setShowNotificationBox: (state, action) => {
            state.showNotificationBox = action.payload
        },
        setInviteFriendBox: (state, action) => {
            state.showInviteFriendBox = action.payload
        },
        setCurrentListId: (state, action) => {
            state.currentListId = action.payload
        },
        setShowProfileBox: (state, action) => {
            state.showProfileBox = action.payload
        },
        setIsBoxVisible: (state, action) => {
            state.isBoxVisible = action.payload
        },
        setIsEffect: (state) => {
            state.isEffect = !state.isEffect
        }
    }
})

export const { setShowNotificationBox, setInviteFriendBox, setIsEffect, setCurrentListId, setIsBoxVisible, setShowProfileBox } = TriggerSlice.actions
export default TriggerSlice.reducer