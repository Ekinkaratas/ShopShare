  import { StyleSheet, Text, Pressable, FlatList, View } from 'react-native'
  import React, { useEffect } from 'react'
  import { useDispatch, useSelector } from 'react-redux';
  import { setShowNotificationBox } from '../redux/TriggerSlice.js';
  import Animated, { BounceIn } from 'react-native-reanimated';
  import FontAwesome from '@expo/vector-icons/FontAwesome';
  import MaterialIcons from '@expo/vector-icons/MaterialIcons';
  import { inviteAccept, inviteReject } from '../redux/DataSlice.js';

  const notificationBox = () => {
      const dispatch = useDispatch()

      const renderItem = ({ item }) => {
        return (
          <Animated.View
            entering={BounceIn}
            style={styles.notificationCard}
          >
            <View style={styles.notificationTextBlock}>
              <Text style={styles.senderName}>
                {item.senderName || 'Unknown user'} 
                {item.senderEmail && ` (${item.senderEmail})`}
              </Text>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.inviteText}>Invited you to collaborate</Text>
            </View>

            <View style={styles.actionButtons}>
              <Pressable 
                style={styles.iconButton} 
                onPress={() => dispatch(inviteAccept(item.id))}
              >
                <FontAwesome name="check" size={16} color="#fff" />
              </Pressable>
              <Pressable 
                style={[styles.iconButton, { backgroundColor: '#e74c3c' }]} 
                onPress={() => dispatch(inviteReject(item.id))}
              >
                <MaterialIcons name="close" size={18} color="#fff" />
              </Pressable>
            </View>
          </Animated.View>
        );
    };


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
              data={pendingData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContent}
              ListEmptyComponent={() => (
                  <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>You Don't Have Any Notification Yet.</Text>
                  </View>
                )}
              showsVerticalScrollIndicator={false}   // estetik görünüm
              overScrollMode="always"                // Android bounce için
              bounces={true}                         // iOS bounce
              keyboardShouldPersistTaps="handled"
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
        height: 320, // Eskiden 150 idi
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        justifyContent: 'flex-start', // dikkat
        alignItems: 'center',
      },
      // --- List (FlatList) Styles ---
      flatList: {
        maxHeight: 250,
        width: '100%',
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
      // render styles

      notificationCard: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        width: 260, // popup içi düzgün yerleşmesi için sabitlik
      },
      notificationTextBlock: {
        flex: 1,
        paddingRight: 10,
      },
      senderName: {
        fontSize: 12,
        color: '#95a5a6',
        marginBottom: 4,
      },
      titleText: {
        fontSize: 15,
        color: '#2c3e50',
        fontWeight: '600',
      },
      actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      iconButton: {
        backgroundColor: '#27ae60',
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      inviteText: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 4,
        fontStyle: 'italic',
      },
      // Make sender info more prominent
      senderName: {
        fontSize: 14,
        color: '#3498db',
        fontWeight: '600',
        marginBottom: 4,
      },
  })