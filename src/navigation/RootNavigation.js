import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import AuthenticatedStack from './AuthenticatedStack'
import GuestStack from './GuestStack'

const RootNavigation = () => {
    const isAuthenticated  = useSelector(state => state.user.isAuthenticated)

    return (
        <NavigationContainer>
            {
                isAuthenticated
                ? <AuthenticatedStack />
                : <GuestStack />
            }
        </NavigationContainer>
    )
}

export default RootNavigation