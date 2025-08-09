import { Text, View } from 'react-native'
import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    showNotificationBox : false,
    showInviteFriendBox : false,
    showProfileBox: false,
    isEffect: false,
    currentListId: null
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
        setCurrentListId: (state, action) => {
            state.currentListId = action.payload
        },
        setShowProfileBox: (state, action) => {
            state.showProfileBox = action.payload
        },
        setIsEffect: (state) => {
            state.isEffect = !state.isEffect
        }
    }
})

export const { setShowNotificationBox, setInviteFriendBox, setIsEffect, setCurrentListId, setShowProfileBox } = TriggerSlice.actions
export default TriggerSlice.reducer