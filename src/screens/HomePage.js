  import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable, FlatList, Platform, Alert, KeyboardAvoidingView } from 'react-native';
  import { useDispatch, useSelector } from 'react-redux';
  import React, { useState, useEffect } from 'react';
  import Fontisto from '@expo/vector-icons/Fontisto';
  import AntDesign from '@expo/vector-icons/AntDesign';
  import CustomTextInput from '../components/CustomTextInput.js';
  import CustomButton from '../components/CustomButton.js';
  import { LogOut } from '../redux/userSlice.js';
  import { addTitle, deleteData, getAllData, toggleListTic } from '../redux/DataSlice.js';
  import Animated from 'react-native-reanimated';
  import { BounceIn, } from 'react-native-reanimated';

  const HomePage = () => {
    const dispatch = useDispatch();

    const [listTitle, setListTitle] = useState('');
    const [isEffect, setIsEffect] = useState(false); // State used to trigger data refresh
    const [showBox, setShowBox] = useState(false);
    const { data, isLoading, error } = useSelector(state => state.userData); // Also get the error state

    useEffect(() => {
      dispatch(getAllData());
      // Added for error handling:
      if (error) {
        Alert.alert("Data Error", error);
      }
    }, [isEffect, error, ]); // useEffect also triggers when error changes

    const handleAddList = async () => {
      if (listTitle.trim() === '') {
        Alert.alert("Warning", "Please enter a title.");
        return;
      }
      
      // Assuming addTitle's payload returns listId and title
      const resultAction = await dispatch(addTitle({ title: listTitle, sharedWith: [] }));
      
      if (addTitle.fulfilled.match(resultAction)) {
        setListTitle(''); // Clear the input
        setIsEffect(!isEffect); // Trigger to refresh the list
      } else {
        Alert.alert("Error", resultAction.payload || "An error occurred while adding the list.");
      }
    };

    const renderItem = ({ item }) => {
      return (
        <Animated.View entering={BounceIn} style={styles.listItem}>
          <Pressable
            onPress={() => {
              // Checkbox click action (update 'tic' field in Firestore)
              // You might consider a separate thunk or local state management for this.
              console.log("Checkbox clicked:", item.id);
              dispatch(toggleListTic(item.id))
              setIsEffect(!isEffect); // Temporarily refresh the list
            }}
            style={styles.checkboxContainer}
          >
            {item.tic ? (
              <Fontisto name="checkbox-active" size={22} color="#2ecc71" /> // Green check
            ) : (
              <Fontisto name="checkbox-passive" size={22} color="#7f8c8d" /> // Gray box
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              // List item click, navigate to detail page or show items
              // navigation.navigate('ListDetail', { listId: item.id, listTitle: item.title });
              console.log("List item clicked:", item.id, item.title);
            }}
            style={styles.listItemTextContainer}
          >
            <Text style={item.tic ? styles.listItemTextStrikethrough : styles.listItemText}>{item.title}</Text>
          </Pressable>
          
          <Pressable style={styles.inviteUser}>
            <AntDesign name="adduser" size={24} color="black" />
          </Pressable>
          {/* Delete button */}
          <Pressable
              onPress={() => {
                  dispatch(deleteData(item.id)); // Add your delete function here if you have one
                  Alert.alert("Delete", `Do you want to delete the list "${item.title}"?`);
                  setIsEffect(!isEffect); // For refresh
              }}
              style={styles.deleteButton}
          >
              <Text style={styles.deleteButtonText}>X</Text>
          </Pressable>
        </Animated.View>
      );
    };

    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer} // Sadece bu view'e özel stil
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Shopping Lists</Text>
            <View style={styles.headerIcons}>
              <Pressable onPress={() => {
                  console.log("set oncesi: ", showBox);
                  setShowBox(prev => !prev);
                  console.log("set sonrasi: ", showBox);
                }}>
                <Fontisto name="bell" size={22} color="#ffffff" />
              </Pressable>  
              <Fontisto name="person" size={22} color="#ffffff" />
            </View>
          </View>

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


          {/* Logout Button (outside of KeyboardAvoidingView) */}
          <View style={styles.logoutButtonContainer}>
            <CustomButton
              title={'Log Out'}
              HandleonPress={() => {
                dispatch(LogOut());
              }}
              handleWidth={'80%'}
              handleBackground={'#e74c3c'}
              handleTextColor={'#ffffff'}
            />
          </View>
            
          {/* notification box controller */}
          {showBox && (
            <Pressable 
              style={styles.notificationContainer}
              onPress={() => setShowBox(false)}  // Karartılmış arka plana tıklayınca kapansın
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
          )}
          
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  };

  export default HomePage;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ecf0f1', // Same light grey background as LogInPage
      paddingTop: Platform.OS === 'android' ? 30 : 0, // Status bar padding for Android
    },
    // --- Header Styles ---
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#2c3e50', // Main button color from LogInPage
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ecf0f1', // Text color matching LogInPage
    },
    headerIcons: {
      flexDirection: 'row',
      gap: 15, // Space between icons
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
  backgroundColor: 'rgba(0,0,0,0.3)',  // İstersen arkaplan karartma
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



    // --- List Item Styles ---
    listItem: { // Card style for each list item
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff', // White card background
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 20, // More horizontal padding
      marginVertical: 8, // Space between list items
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    checkboxContainer: {
      paddingRight: 15, // Space between checkbox and text
      paddingVertical: 5, // Increase clickable area
    },
    listItemTextContainer: {
      flex: 1, // Takes up remaining space
      justifyContent: 'center',
    },
    listItemText: {
      fontSize: 17,
      color: '#2c3e50', // Dark text color
      fontWeight: '500',
    },
    listItemTextStrikethrough: {
      fontSize: 17,
      color: '#95a5a6', // Grey for completed items
      textDecorationLine: 'line-through',
      fontStyle: 'italic',
    },
    inviteUser:{
      backgroundColor: '#dff9fb',
      padding: 4,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    
    },
    deleteButton: {
        marginLeft: 15,
        backgroundColor: '#e74c3c', // Red delete button
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

    // --- Add List Input Area Styles ---
    keyboardAvoidingContainer: {
      flex: 1, // Occupy full width
      // flex: 0, // Can be used if there are issues with stretching
    },
    addListInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
      alignSelf: 'center', // Center horizontally
      paddingVertical: 15,
      // Adjust marginBottom based on platform to avoid double padding with KeyboardAvoidingView
      marginBottom: Platform.OS === 'ios' ? 0 : 15, 
      backgroundColor: '#ffffff', // White background for the input card
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
      borderColor: '#bdc3c7', // Light grey border
      borderRadius: 25,
      paddingHorizontal: 20,
      backgroundColor: '#ecf0f1', // Light grey input background
      fontSize: 16,
      color: '#2c3e50',
    },
    addButton: {
      width: 80,
      height: 50,
      backgroundColor: '#2ecc71', // Vibrant green, similar to LogInPage accent
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
    // --- Logout Button Style ---
    logoutButtonContainer: {
      width: '100%',
      alignItems: 'center',
      paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Safe area padding for iOS
      backgroundColor: '#ecf0f1', // Matches background
    },
  });