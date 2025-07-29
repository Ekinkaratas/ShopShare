import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setShowNotificationBox } from '../redux/TriggerSlice.js';

const notificationBox = () => {
    const dispatch = useDispatch()

  return (
    <Pressable 
    style={styles.notificationContainer}
    onPress={() => dispatch(setShowNotificationBox(false))}  // Karartılmış arka plana tıklayınca kapansın
    >
        <Pressable
        style={styles.popupBox}
        onPress={(e) => e.stopPropagation()} // İç kutuya tıklayınca arka plan kapanmasın diye
        >
            <Text style={{ fontWeight: 'bold' }}>📢 notifications</Text>
            <Text>• Yeni bir görev eklendi</Text>
            <Text>• Paylaşilan liste güncellendi</Text>
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
})