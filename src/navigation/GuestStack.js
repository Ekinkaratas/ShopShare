import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LogInPage  from '../screens/LogInPage.js'
import RegisterPage  from '../screens/RegisterPage.js'

const Stack = createNativeStackNavigator()

const UserStack = () => {
  return (
    <Stack.Navigator initialRouteName='LogIn' screenOptions={{ headerShown: false }}>
        <Stack.Screen name={"LogIn"}  component={LogInPage} />
        <Stack.Screen name={"Register"} component={RegisterPage} />
    </Stack.Navigator>
  )
}

export default UserStack