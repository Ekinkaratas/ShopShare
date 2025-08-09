import { StyleSheet, Text, View, Pressable, SafeAreaView, TextInput, FlatList, Alert, StatusBar, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useRoute } from '@react-navigation/native'
import Fontisto from '@expo/vector-icons/Fontisto';
import { useDispatch, useSelector } from 'react-redux'
import { addItem, toggleBought,  listenToFindAllItem, deleteItem } from '../redux/DataSlice'
import Animated from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import ListUsers from '../components/ListUsers';
import Header from '../components/Header';
import { setIsBoxVisible } from '../redux/TriggerSlice';

const ListPage = ({navigation}) => {
 const route = useRoute()
 const dispatch = useDispatch()
 const [mission, setMission] = useState('')
 const [quantity, setQuantity] = useState(1);

 const isBoxVisible = useSelector(state => state.trigger.isBoxVisible)
 
 const { listId, listTitle } = route.params

 const items = useSelector(state => state.userData.items)

 const quantityOptions = Array.from({length: 100}, (_,i) => i+1)

 useEffect(() => {
  const unsubscribe = dispatch(listenToFindAllItem(listId));
  return () => {
    try {
      unsubscribe?.();
    } catch (e) {
      console.error("Unsubscribe error:", e);
    }
  };
}, [dispatch, listId]);


 const handleMissionChange = (value) => {
  setMission(value);
  if (value.trim() === '') {
   setQuantity(1);
  }
 };

 const renderItem = ({item}) => {
  return(
   <Animated.View style={styles.itemCard}>
    <View style={{ flex: 1 }}>
     <Text style={[styles.itemName, item.isBought && styles.itemBoughtText]}>{item.mission}</Text>
     <Text style={[styles.itemQuantity, item.isBought && styles.itemBoughtText]}>Quantity: {item.quantity}</Text>
    </View>

    <Pressable
     onPress={() => {
      const itemId = item.id;
      dispatch(toggleBought({listId,itemId}))
     }}
     style={styles.checkboxContainer}
    >
     {item.isBought ? (
      <Fontisto name="checkbox-active" size={24} color="#27ae60" />
     ) : (
      <Fontisto name="checkbox-passive" size={24} color="#95a5a6" />
     )}
    </Pressable>

    <Pressable
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
                  dispatch(deleteItem({listId, itemId: item.id}));
                }
              }
            ]
          );
    
      }}
      style={styles.deleteButton}
  >
      <Text style={styles.deleteButtonText}>X</Text>
    </Pressable>
   </Animated.View>
  )
 }

 const isMissionEmpty = mission.trim() === ''
  // Calculate dynamic styles for picker and itemStyle
  const pickerStyle = [styles.quantityPicker, isMissionEmpty && styles.disabledPicker];
  const pickerItemStyle = Platform.OS === 'ios' && isMissionEmpty ? styles.disabledPickerItem : {};


 return (
  <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#34495e"
        barStyle="light-content"
      />
   {/* Header*/}
    <Header 
        handleBackAction = {() => {navigation.navigate('Home')}}
        handleTitle = {listTitle} 
        handleIcon1 = 'account-group' 
        handleIconPress1 = {() => {dispatch(setIsBoxVisible(true))}} 
        handleIcon2= 'null' 
        handleIconPress2='null'
      />

   {/* Mission */}
   <View style = {styles.middleSpace}>
     <FlatList
     data={items}
     renderItem={renderItem}
     keyExtractor={item => item.id}
     style={styles.flatList}
     contentContainerStyle={styles.flatListContent}
     ListEmptyComponent={() => (
      <View style={styles.emptyListContainer}>
       <Text style={styles.emptyListText}>No items in this list yet!</Text>
       <Text style={styles.emptyListSubText}>Add new items below to get started.</Text>
      </View>
     )}
     />
   </View>

   <View style={styles.addInputSection}>
    {/* Mission Input */}
    <TextInput
     value={mission}
     onChangeText={handleMissionChange}
     placeholder={"Add a new item..."}
     placeholderTextColor="#a0a0a0"
     style={styles.fullWidthTextInput}
    />

    <View style={styles.quantityAndAddContainer}>
      <View style={[styles.quantityPickerWrapper, isMissionEmpty && styles.disabledPickerWrapper]}>
        <Picker
          selectedValue={quantity}
          onValueChange={(itemValue) => setQuantity(itemValue)}
          style={pickerStyle}
                    itemStyle={pickerItemStyle}
          enabled = {!isMissionEmpty}
        >
          {quantityOptions.map((num) => (
            <Picker.Item key={num} label={num.toString()} value={num} />
          ))}
        </Picker>
      </View>
      
      {/* Add Button */}
      <Pressable
      onPress={() => {
        if (isMissionEmpty) { 
          Alert.alert("Missing Information", "Please enter an item name.");
          return;
        }
        dispatch(addItem({ mission, quantity, listId }))
        setMission('');
        setQuantity(1); 
      }}
      style={[styles.addButtonStacked, isMissionEmpty && styles.disabledButton]}
            disabled={isMissionEmpty}
      >
      <Text style={styles.addButtonText}>Add Item</Text>
      </Pressable>
    </View>
   </View>

   {isBoxVisible && (
      <Pressable style={styles.overlay} onPress={() => dispatch(setIsBoxVisible(false))}>
        <Pressable style={styles.myBox} onPress={(e) => {
          // This stops the touch event from "bubbling" up to the overlay
          e.stopPropagation();
        }}>
          <ListUsers listId={listId} />
        </Pressable>
      </Pressable>
    )}
  </SafeAreaView>
 )
}

export default ListPage;

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#f4f7f6',
 },

 middleSpace: {
  flex: 1,
  paddingTop: 10,
 },
 flatList: {
  flexGrow: 1,
 },
 flatListContent: {
  paddingBottom: 20,
 },
 emptyListContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 50,
  paddingHorizontal: 20,
 },
 emptyListText: {
  fontSize: 18,
  color: '#7f8c8d',
  textAlign: 'center',
  marginBottom: 8,
  fontWeight: '500',
 },
 emptyListSubText: {
  fontSize: 16,
  color: '#95a5a6',
  textAlign: 'center',
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
 addInputSection: {
  paddingHorizontal: 15,
  paddingVertical: 15,
  backgroundColor: '#ffffff',
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',
 },
 fullWidthTextInput: {
  height: 48,
  borderWidth: 1,
  borderColor: '#dcdcdc',
  borderRadius: 25,
  paddingHorizontal: 15,
  backgroundColor: '#f9f9f9',
  color: '#34495e',
  fontSize: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  marginBottom: 10,
 },
 quantityAndAddContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
 },
 quantityPickerWrapper: {
  flex: 1,
  height: 48,
  borderWidth: 1,
  borderColor: '#dcdcdc',
  borderRadius: 25,
  backgroundColor: '#f9f9f9',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  justifyContent: 'center',
  overflow: 'hidden',
 },
 disabledPickerWrapper: {
  backgroundColor: '#e0e0e0',
  borderColor: '#bdbdbd',
  shadowOpacity: 0,
  elevation: 0,
 },
  // To dynamically manage picker text color for Android
  disabledPicker: {
    color: '#9e9e9e',
  },
  // To dynamically manage the text color of the Picker Item in iOS
  disabledPickerItem: {
    color: '#9e9e9e',
  },
 quantityPicker: {
  height: 48,
  width: '100%',
    color: '#34495e', // Default color for Android
 },
 pickerItem: {
  fontSize: 16,
  height: 48,
 },
 addButtonStacked: {
  flex: 1.5,
  height: 48,
  backgroundColor: '#2980b9',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 25,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
 },
  // Special style for the disabled button
  disabledButton: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
 addButtonText: {
  color: '#ffffff',
  fontWeight: '700',
  fontSize: 16,
 },

 itemCard: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 15,
  paddingVertical: 15,
  paddingHorizontal: 20,
  marginVertical: 8,
  marginHorizontal: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 4,
  borderLeftWidth: 5,
  borderLeftColor: '#3498db',
 },
 itemName: {
  fontSize: 17,
  color: '#2c3e50',
  fontWeight: '600',
  marginBottom: 4,
 },
 itemQuantity: {
  fontSize: 15,
  color: '#7f8c8d',
 },
 itemBoughtText: {
  textDecorationLine: 'line-through',
  color: '#a0a0a0',
 },
 checkboxContainer: {
  padding: 10,
 },
 overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99, // Ensure it's on top of everything else
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