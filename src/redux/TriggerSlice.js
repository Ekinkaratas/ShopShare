import { Text, View } from 'react-native'
import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    showNotificationBox : false,
    showInviteFriendBox : false,
}

export const TriggerSlice = createSlice({
    name: 'trigger',
    initialState,
    reducers:{
        setShowNotificationBox:(state,action) => {
            state.showNotificationBox = action.payload
        },
        setInviteFriendBox: (state, action) => {
            state.showInviteFriendBox = action.payload
        },
    }
})

export const { setShowNotificationBox, setInviteFriendBox } = TriggerSlice.actions
export default TriggerSlice.reducer