import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomePage from '../screens/HomePage.js'
import ListDetail from '../screens/ListDetail.js'
const Stack = createNativeStackNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} >
        <Stack.Screen  name = "Home" component={HomePage} />
        <Stack.Screen name = "ListDetail" component={ListDetail} />
    </Stack.Navigator>
  )
}

export default AuthStack