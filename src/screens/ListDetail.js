import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native'
import React, {useState} from 'react'
import { useRoute } from '@react-navigation/native'

const ListPage = () => {
  const route = useRoute()
  const { listId, listTitle } = route.params

  return (
    <View>
      <Text>ListPage</Text>
    </View>
  )
}

export default ListPage

const styles = StyleSheet.create({})