import { StyleSheet, Text, Pressable, FlatList, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setShowNotificationBox } from '../redux/TriggerSlice.js';
import Animated, { BounceIn } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const notificationBox = () => {
    const dispatch = useDispatch()

    const renderItem = ({item}) =>{
        return(
          <Animated.View entering={BounceIn} style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text> { item.senderName } </Text>
            </View>

            <View>
              <Text> { item.title } </Text>
            </View>

            <View style = {{ paddingHorizontal: 5 }}>
              <FontAwesome name="plus" size={24} color="green" />

              <MaterialIcons name="cancel" size={24} color="black" />
            </View>
          </Animated.View>
        )
    }

    const pendingData = useSelector(state => state.userData.pendingData);


  return (
    <Pressable 
    style={styles.notificationContainer}
    onPress={() => dispatch(setShowNotificationBox(false))}
    >
        <Pressable
        style={styles.popupBox}
        onPress={(e) => e.stopPropagation()} 
        >
           <FlatList 
              data={ pendingData }
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
              ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>You Don't Have Any Notification Yet.</Text>
                </View>
              )}
           />
        </Pressable>
    </Pressable>
  )
}

export default notificationBox

const styles = StyleSheet.create({
    //--- notification Box Styles ---
    notificationContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    popupBox: {
      width: 300,
      height: 150,
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // --- List (FlatList) Styles ---
    flatList: {
      flex: 1, // Ensures FlatList takes up available vertical space
      paddingHorizontal: 15,
      marginTop: 20, // Space below the header
    },
    flatListContent: {
      paddingBottom: 20, // Padding at the bottom of the list content
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      color: '#7f8c8d',
    },
    emptyListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
    emptyListText: {
      fontSize: 16,
      color: '#7f8c8d',
      textAlign: 'center',
      marginTop: 5,
    },
})