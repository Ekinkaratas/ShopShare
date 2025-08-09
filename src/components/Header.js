import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Appbar } from 'react-native-paper'


const Header = ({navigation,handleBackAction, handleTitle,handleIcon1,handleIconPress1,handleIcon2, handleIconPress2}) => {
  return (
    <View>
      <Appbar.Header style ={{backgroundColor:'#34495e'}}>
        {typeof handleBackAction === 'function' && (
          <Appbar.BackAction onPress={handleBackAction} color='#ecf0f1'/>
        )}

        <Appbar.Content title={handleTitle} style={{ alignItems: 'center'}} color='#ecf0f1'/>

        {handleIcon1 !== 'null' && typeof handleIconPress1 === 'function' && (
          <Appbar.Action icon={handleIcon1} onPress={handleIconPress1}  color='#ecf0f1' />
        )}
        
        {handleIcon2 !== 'null' && typeof handleIconPress2 === 'function' && (
          <Appbar.Action icon={handleIcon2} onPress={handleIconPress2}  color='#ecf0f1' />
        )}
        
      </Appbar.Header>
    </View>
  )
}

export default Header