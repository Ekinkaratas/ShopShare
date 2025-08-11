import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  Platform,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import NotificationBox from '../components/NotificationBox.js';
import CustomButton from '../components/CustomButton.js';
import { LogOut } from '../redux/userSlice.js';
import { addTitle, deleteData, listenToUserLists, listenToPendingInvitation } from '../redux/DataSlice.js';
import { setShowNotificationBox, setInviteFriendBox, setIsEffect, setCurrentListId, setShowProfileBox } from '../redux/TriggerSlice.js';
import Animated from 'react-native-reanimated';
import { BounceIn, } from 'react-native-reanimated';
import InviteFriendBox from '../components/InviteFriendBox.js';
import ProfileBox from '../components/ProfileBox.js';
import Header from '../components/Header.js';
import useKeyboardHeight from '../components/useKeyboardHeight.js';

const HomePage = ({ navigation }) => {
  const dispatch = useDispatch();

  const [listTitle, setListTitle] = useState('');
  const keyboardHeight = useKeyboardHeight();

  const showNotificationBox = useSelector(state => state.trigger.showNotificationBox)
  const showInviteFriendBox = useSelector(state => state.trigger.showInviteFriendBox)
  const showProfileBox = useSelector(state => state.trigger.showProfileBox)

  const pendingData = useSelector(state => state.userData.pendingData)

  const iconBell = pendingData.length > 0 ? 'bell-badge' : 'bell'


  const { data, isLoading, listBuyStatus, } = useSelector(state => state.userData);
  const currentUserUid = useSelector(state => state.user.userUid);

  useEffect(() => {
    // Store unsubscribe functions
    let unsubToUserLists;
    let unsubToPendingInvitation;

    // Initialize listeners
    const setupListeners = async () => {
      unsubToUserLists = await dispatch(listenToUserLists());
      unsubToPendingInvitation = await dispatch(listenToPendingInvitation());
    };

    setupListeners();

    // Cleanup function
    return () => {
      // Check if unsubscribe functions exist before calling them
      if (unsubToUserLists && typeof unsubToUserLists === 'function') {
        unsubToUserLists();
      }
      if (unsubToPendingInvitation && typeof unsubToPendingInvitation === 'function') {
        unsubToPendingInvitation();
      }
    };
  }, [dispatch, currentUserUid]);

  const handleAddList = async () => {
    if (listTitle.trim() === '') {
      Alert.alert("Warning", "Please enter a title.");
      return;
    }

    const resultAction = await dispatch(addTitle({ title: listTitle }));

    if (addTitle.fulfilled.match(resultAction)) {
      setListTitle('');
      dispatch(setIsEffect());
    } else {
      Alert.alert("Error", resultAction.payload || "An error occurred while adding the list.");
    }
  };

  const renderItem = ({ item }) => {
    const isAllBought = listBuyStatus[item.id] || false;

    return (
      <Animated.View entering={BounceIn} style={styles.listItem}>

        {/* isAllBought Control Part */}
        <View style={styles.checkboxContainer}>
          {isAllBought ? (
            <Fontisto name="checkbox-active" size={22} color="#2ecc71" />
          ) : (
            <Fontisto name="checkbox-passive" size={22} color="#7f8c8d" />
          )}
        </View>



        {/* ListDetail Navigation Part */}
        <Pressable
          onPress={() => {
            navigation.navigate('ListDetail', { listId: item.id, listTitle: item.title });
            console.log("List item clicked:", item.id, item.title);
          }}
          style={styles.listItemTextContainer}
        >
          <Text style={isAllBought ? styles.listItemTextStrikethrough : styles.listItemText}>{item.title}</Text>
        </Pressable>

        {/* Add User Button */}
        {item.createdBy === currentUserUid &&
          (<Pressable
            style={styles.inviteUser}
            onPress={() => {
              dispatch(setInviteFriendBox(true)),
                dispatch(setCurrentListId(item.id)),
                dispatch(setIsEffect())
            }}
          >
            <AntDesign name="adduser" size={24} color="black" />
          </Pressable>)
        }


        {/* Delete button */}
        {item.createdBy === currentUserUid &&
          (<Pressable
            onPress={() => {
              // Alert.alert(title, message, buttonsArray, options);
              Alert.alert(
                "Delete",
                `Do you want to delete the list "${item.title}"?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      dispatch(deleteData(item.id));
                    }
                  }
                ]
              );

            }}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>X</Text>
          </Pressable>)
        }

      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#2c3e50" // status bar background color for Android
        barStyle="light-content"  // Set the icon color to light for iOS and Android 
      />

      {/* Header Section */}
      <Header
        handleBackAction='null'
        handleTitle='My Shopping Lists'
        handleIcon1={iconBell}
        handleIconPress1={() => { dispatch(setShowNotificationBox(true)) }}
        handleIcon2='account'
        handleIconPress2={() => { dispatch(setShowProfileBox(true)) }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* List Display */}
        {isLoading ? (

          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading lists...</Text>
          </View>
        )
          : (<FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>You don't have any lists yet.</Text>
                <Text style={styles.emptyListText}>Add a new list below!</Text>
              </View>
            )}
          />
          )}

        <View style={styles.addListInputContainer}>
          {/* Add Button */}
          <TextInput
            value={listTitle}
            onChangeText={setListTitle}
            placeholder={"New list title..."}
            placeholderTextColor="#95a5a6"
            style={styles.textInput}
          />
          <Pressable
            onPress={handleAddList}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>


      {/* notification box controller */}
      {showNotificationBox && (<NotificationBox />)}

      {/* Invite Friends Box Controller */}
      {showInviteFriendBox && (<InviteFriendBox />)}

      {/* Profile Box Controller */}
      {showProfileBox &&
        (<Pressable
          style={styles.overlay}
          onPress={() => dispatch(setShowProfileBox(false))}
        >
          <Pressable
            style={styles.myBox}
            onPress={(e) => { e.stopPropagation() }}
          >
            <ProfileBox />
          </Pressable>
        </Pressable>)
      }
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  //  List (FlatList) Styles 
  flatList: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 20,
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
  //  List Item Styles 
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  checkboxContainer: {
    paddingRight: 15,
    paddingVertical: 5,
  },
  listItemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 17,
    color: '#2c3e50',
    fontWeight: '500',
  },
  listItemTextStrikethrough: {
    fontSize: 17,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  inviteUser: {
    backgroundColor: '#dff9fb',
    padding: 4,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    marginLeft: 15,
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  //  Add List Input Area Styles 
  keyboardAvoidingContainer: {
    flex: 1,
  },
  addListInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 15,
    marginBottom: Platform.select({
      ios: 20,
      android: 10,
    }),
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    height: 50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: '#ecf0f1',
    fontSize: 16,
    color: '#2c3e50',
  },
  addButton: {
    width: 80,
    height: 50,
    backgroundColor: '#2ecc71',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  //  Logout Button Style 
  logoutButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Safe area padding for iOS
    backgroundColor: '#ecf0f1',
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: ('rgba(0,0,0,0.4)'),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
  myBox: {
    position: 'absolute',
    top: '10%',
    right: '5%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    maxHeight: 300,
  }
});