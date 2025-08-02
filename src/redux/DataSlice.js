import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { } from 'react'
import { addDoc, collection, getDoc, getDocs, serverTimestamp, updateDoc, doc, deleteDoc, query, where, setDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { db } from '../../config/firebaseConfig'
import { setIsEffect } from './TriggerSlice'

export const addUsers = createAsyncThunk('/user/addTitle', async (props , { rejectWithValue, }) => {
  try {

    await setDoc(doc(db,'users', props.uid), {
      userUid: props.uid,
      name: props.name,
      surname: props.surname,
      email: props.email,
      createdAt: serverTimestamp(),
    });

    // await addDoc(collection(db,'shoppingList', docRef.id , 'items'),{
    //   name: props.items.name,
    //   quantity: props.items.quantity,
    //   isBought: false,
    //   addedBy: props.items.uid,
    //   addedAt: serverTimestamp(),
    // })
  } catch (error) {
    console.log("addUser error: ", error);
    return rejectWithValue(error.message);
  }
});

export const addTitle = createAsyncThunk('/user/addTitle', async (props, {getState, rejectWithValue }) => {
  try {
    const state = getState()

    // console.log("Kullanici props:", props);
    if (!props.title || props.title.trim() === '') {
      return rejectWithValue("Boş başlik gönderilemez.");
    }

    // console.log('userUidL: ', state.user.userUid )

    await addDoc(collection(db,'lists'), {
      title: props.title,
      createdBy: state.user.userUid,
      sharedWith: [],
      invitePending: [],
      createdAt: serverTimestamp(),
      tic: false
    });


    // await addDoc(collection(db,'shoppingList', docRef.id , 'items'),{
    //   name: props.items.name,
    //   quantity: props.items.quantity,
    //   isBought: false,
    //   addedBy: props.items.uid,
    //   addedAt: serverTimestamp(),
    // })
  } catch (error) {
    console.log("addTitle error: ", error);
    return rejectWithValue(error.message);
  }
});

export const getAllData = createAsyncThunk('/user/getAllData',async (_ , { getState, rejectWithValue }) => {
    try {

      const state = getState();
      const userUid = state.user.userUid;

      // console.log('userUid: ', userUid )

      const createdByQuery = query(
        collection(db, 'lists'),
        where('createdBy', '==', userUid)
      );
      const sharedWithQuery = query(
        collection(db, 'lists'),
        where('sharedWith', 'array-contains', userUid)
      );

      const allItems = [];

      const createdSnapshot = await getDocs(createdByQuery);
      createdSnapshot.forEach(doc => {
        allItems.push({ id: doc.id, ...doc.data() });
      });

      const sharedSnapshot = await getDocs(sharedWithQuery);
      sharedSnapshot.forEach(doc => {
        if (!allItems.find(item => item.id === doc.id)) {
          allItems.push({ id: doc.id, ...doc.data() });
        }
      });

      return allItems;
      
    } catch (error) {
      console.log("getAllData Thunk Error: ", error);
      return rejectWithValue(error.message);
    }
  }
);

export const getPendingEmail = createAsyncThunk('user/getPendingEmail',async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const userUid = state.user.userUid; // Redux store'daki user slice'ından e-postayı alıyoruz

      const inviteQuery = query(
        collection(db, 'lists'),
        where('invitePending', 'array-contains', userUid)
      );

      const allItems = [];

      const inviteSnapshot = await getDocs(inviteQuery);

      for (const docSnap of inviteSnapshot.docs) {
        const data = docSnap.data();
        const createdByUid = data.createdBy;

        let senderName = 'Unknown';

        if (createdByUid) {
          const senderDocRef = doc(db, 'users', createdByUid);
          const senderSnap = await getDoc(senderDocRef);
          if (senderSnap.exists()) {
            const userData = senderSnap.data();
            senderName = userData.name + ' ' + (userData.surname || '');
          }
        }

        allItems.push({
          id: docSnap.id,
          ...data,
          senderName: senderName.trim(),
        });
      }
      console.log('Returned pending items:', allItems);

      return allItems;
    } catch (error) {
      console.log("getPendingEmail Thunk Error: ", error);
      return rejectWithValue(error.message);
    }
  }
);

export const toggleListTic = createAsyncThunk('user/toggleListTic', async(itemId, { rejectWithValue}) => {
  try {

    const docRef = doc(db,'lists', itemId)
    
     const docSnap = await getDoc(docRef); // 🔄 Get current values

      if (!docSnap.exists()) {
        return rejectWithValue('Document not found');
      }

      const currentTic = docSnap.data().tic;

      await updateDoc(docRef, {
        tic: !currentTic, // 🔁 Reversal
      });
  } catch (error) {
    console.log('toggleListTic Thunk Error: ', error)
    return rejectWithValue(error.message)
  }
})

export const deleteData = createAsyncThunk('/user/deleteData', async(itemId , {getState, rejectWithValue}) => {
  try {

    if (!itemId) {
      console.log("Silinecek liste ID'si bulunamadi.");
      return rejectWithValue("Liste ID'si geçersiz.");
    }

    await deleteDoc(doc(db,'lists', itemId))
    Alert.alert("Successful", "Document deleted successfully.");

  } catch (error) {
    console.log('deleteData Thunk error: ', error)
    Alert.alert("Error", "There was a problem deleting the document.");
    return rejectWithValue(error.message)
  }
})

export const handleInvite = createAsyncThunk('/user/handleInvite', async(email , {getState, rejectWithValue, dispatch}) => {
        try {

            const state = getState()
            const currListId = state.trigger.currentListId

            if (!email || email.trim() === '') {
                Alert.alert('Warning', 'Please enter a valid email address.');
                return;
            }

            const docRef = await doc(db,'lists', currListId)
            const docSnap = await getDoc(docRef)
            
            if(!docSnap.exists()){
               Alert.alert('error', 'List Not Found, May Have Been Removed')
               return rejectWithValue('List Not Found, May Have Been Removed');
            }

            const questRef = await query(
                collection(db,'users'),
                where('email', '==', email)
            )

            const questSnap = await getDocs(questRef)

            if(questSnap.empty){
               Alert.alert('error', 'User Not Found')
               return rejectWithValue('User Not Found');
            }

            const userDoc = questSnap.docs[0];
            const userUid = userDoc.data().userUid;

            updateDoc(docRef,{
                invitePending: arrayUnion(userUid)
            })

            Alert.alert('Success', 'Invitation sent!');
            dispatch(setIsEffect())

            return true
        } catch (error) {
            console.log("InviteFriendBox 'handleInvite' Thunk Error: ", error)
            Alert.alert('Error',"Could Not Be Invited")
        }
    }
  )

export const inviteAccept = createAsyncThunk('user/inviteAccept', async(itemId, { getState, rejectWithValue, dispatch }) =>{
  try {

    const state = getState()
    const userUid = state.user.userUid

    const docRef = doc(db,'lists', itemId)

    await updateDoc(docRef,{
      invitePending: arrayRemove(userUid),
      sharedWith: arrayUnion(userUid)
    })
    
    dispatch(setIsEffect())

    return 
  } catch (error) {
    console.log('inviteAccept Thunk Error:', error);
    return rejectWithValue(error.message);
  }
})

export const inviteReject = createAsyncThunk('user/inviteReject', async(itemId, { getState, rejectWithValue, dispatch }) =>{
  try {

    const state = getState()
    const userUid = state.user.userUid

    const docRef = doc(db,'lists', itemId)

    await updateDoc(docRef,{
      invitePending: arrayRemove(userUid)
    })
    
    dispatch(setIsEffect())

    return 
  } catch (error) {
    console.log('inviteReject Thunk Error:', error);
    return rejectWithValue(error.message);
  }
})




const initialState = {
  data: [],
  pendingData: [],
  setData: [],
  isLoading: false,
  error: null,
};

const DataSlice = createSlice({
  name: 'userData',
  initialState,
  reducer:{
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
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
      })
      .addCase(getPendingEmail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPendingEmail.fulfilled, (state,action) => {
        state.isLoading = false
        state.pendingData = action.payload
      })
      .addCase(getPendingEmail.rejected, (state,action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(addUsers.rejected, (state, action) => {
      console.log("User ekleme hatası:", action.payload);
      state.error = action.payload; // istersen store’da hata gösterimi için
      })
      .addCase(handleInvite.rejected, (state,action) =>{
          state.error = action.payload
      })
      .addCase(inviteAccept.rejected, (state,action) =>{
          state.error = action.payload
      })
  },
})

export const { setData } = DataSlice.actions;
export default DataSlice.reducer