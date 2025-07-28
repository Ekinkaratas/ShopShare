import { StyleSheet, Text, View, Alert } from 'react-native'
import React from 'react'
import { addDoc, collection, getDoc, getDocs, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { db } from '../../config/firebaseConfig'

export const addTitle = createAsyncThunk('/user/addTitle', async (props, {getState, rejectWithValue }) => {
  try {
    const state = getState()
    console.log("Kullanici props:", props);
    if (!props.title || props.title.trim() === '') {
      return rejectWithValue("Boş başlik gönderilemez.");
    }


    const userUid = state.user.userUid
    console.log("Kullanici UID:", userUid);
    const docRef = await addDoc(collection(db, 'shoppingLists',userUid, 'lists'), {
      title: props.title,
      sharedWith: props.sharedWith, // be array
      createdAt: serverTimestamp(),
      tic: false
    });

    // await addDoc(collection(db,'shoppingList', docRef.id , 'items'),{
    //   name: props.items.name,
    //   quantity: props.items.quantity,
    //   isBought: props.items.isBought,
    //   addedBy: props.items.uid,
    //   addedAt: serverTimestamp(),
    // })
  } catch (error) {
    console.log("addTitle error: ", error);
    return rejectWithValue(error.message);
  }
});

export const getAllData = createAsyncThunk('/user/getAllData', async(_ , {getState, rejectWithValue }) => {
  try {
    const state = getState()
    const userUid = state.user.userUid

    const querySnapshot = await getDocs(collection(db, 'shoppingLists', userUid, 'lists'))
    const items = []
    querySnapshot.forEach( (doc) => {
      items.push({ id: doc.id, ...doc.data() })
    });  
    return items
    
  } catch (error) {
    console.log("getAllData Thunk Error: ", error)
    return rejectWithValue(error.message)
  }
})

export const toggleListTic = createAsyncThunk('user/toggleListTic', async(itemId, {getState, rejectWithValue}) => {
  try {
    const state = getState()
    const userUid = state.user.userUid

    const docRef = doc(db, 'shoppingLists', userUid, 'lists', itemId)
    
     const docSnap = await getDoc(docRef); // 🔄 Get current values

      if (!docSnap.exists()) {
        return rejectWithValue('Document not found');
      }

      const currentTic = docSnap.data().tic;

      await updateDoc(docRef, {
        tic: !currentTic, // 🔁 Reversal
      });
    Alert.alert('Successful', 'Document successfully updated.');
  } catch (error) {
    console.log('toggleListTic Thunk Error: ', error)
    return rejectWithValue(error.message)
  }
})

export const deleteData = createAsyncThunk('/user/deleteData', async(itemId , {getState, rejectWithValue}) => {
  try {
    const state = getState()
    const userUid = state.user.userUid
    
    await deleteDoc(doc(db, 'shoppingLists', userUid, 'lists', itemId))
    Alert.alert("Successful", "Document deleted successfully.");

  } catch (error) {
    console.log('deleteData Thunk error: ', error)
    Alert.alert("Error", "There was a problem deleting the document.");
    return rejectWithValue(error.message)
  }
})

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const DataSlice = createSlice({
  name: 'userData',
  initialState,
  reducer:{},
  extraReducers: (builder) => {
    builder
      .addCase(getAllData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
})

export default DataSlice.reducer