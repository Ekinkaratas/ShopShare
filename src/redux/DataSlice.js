import { StyleSheet, Text, View, Alert } from 'react-native'
import React from 'react'
import { addDoc, collection, getDoc, getDocs, serverTimestamp, updateDoc, doc, deleteDoc, query, where, setDoc, arrayRemove, arrayUnion, onSnapshot } from 'firebase/firestore'
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { db } from '../../config/firebaseConfig'
import { setIsEffect } from './TriggerSlice'

export const addUsers = createAsyncThunk('/user/addTitle', async (props, { rejectWithValue, }) => {
  try {

    await setDoc(doc(db, 'users', props.uid), {
      userUid: props.uid,
      name: props.name,
      surname: props.surname,
      email: props.email,
      createdAt: serverTimestamp(),
    });


  } catch (error) {
    console.log("addUser error: ", error);
    return rejectWithValue(error.message);
  }
});

export const addTitle = createAsyncThunk('/user/addTitle', async (props, { getState, rejectWithValue }) => {
  try {
    const state = getState()

    // console.log("Kullanici props:", props);
    if (!props.title || props.title.trim() === '') {
      return rejectWithValue("Boş başlik gönderilemez.");
    }

    // console.log('userUidL: ', state.user.userUid )

    await addDoc(collection(db, 'lists'), {
      title: props.title,
      createdBy: state.user.userUid,
      sharedWith: [],
      invitePending: [],
      createdAt: serverTimestamp()
    });

  } catch (error) {
    console.log("addTitle error: ", error);
    return rejectWithValue(error.message);
  }
});

// export const getAllData = createAsyncThunk('/user/getAllData',async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const userUid = state.user.userUid;

//       const createdByQuery = query(collection(db, 'lists'), where('createdBy', '==', userUid));
//       const sharedWithQuery = query(collection(db, 'lists'), where('sharedWith', 'array-contains', userUid));

//       const createdSnapshot = await getDocs(createdByQuery);
//       const sharedSnapshot = await getDocs(sharedWithQuery);

//       const combinedDocs = createdSnapshot.docs.concat(
//         sharedSnapshot.docs.filter((doc) => !createdSnapshot.docs.some((createdDoc) => createdDoc.id === doc.id))
//       );

//       const userUids = new Set();
//       combinedDocs.forEach(doc => {
//         const data = doc.data();
//         if (data.createdBy) userUids.add(data.createdBy);
//         if (data.sharedWith && Array.isArray(data.sharedWith)) {
//           data.sharedWith.forEach(uid => userUids.add(uid));
//         }
//       });

//       const userQueries = [...userUids].map(uid => getDoc(doc(db, 'users', uid)));
//       const userSnapshots = await Promise.all(userQueries);

//       const usersMap = {};
//       userSnapshots.forEach(snap => {
//         if (snap.exists()) {
//           usersMap[snap.id] = { uid: snap.id, ...snap.data() };
//         }
//       });

//       // Doğrudan `map` işleminin sonucunu döndürüyoruz
//       return combinedDocs.map(doc => {
//         const data = doc.data();
//         const createdByUser = usersMap[data.createdBy] || {};
//         const sharedUsersData = (data.sharedWith || []).map(uid => usersMap[uid]).filter(Boolean);

//         return {
//           id: doc.id,
//           ...data,
//           createdByUserData: createdByUser,
//           sharedWithUserData: sharedUsersData,
//         };
//       });
//     } catch (error) {
//       console.error("getAllData Thunk Error: ", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const getPendingEmail = createAsyncThunk('user/getPendingEmail',async (_, { getState, rejectWithValue, dispatch }) => {
//     try {
//       const state = getState();
//       const userUid = state.user.userUid; // Redux store'daki user slice'ından e-postayı alıyoruz

//       const inviteQuery = query(
//         collection(db, 'lists'),
//         where('invitePending', 'array-contains', userUid)
//       );

//       const allItems = [];

//       const inviteSnapshot = await getDocs(inviteQuery);

//       for (const docSnap of inviteSnapshot.docs) {
//         const data = docSnap.data();
//         const createdByUid = data.createdBy;

//         let senderName = 'Unknown';

//         if (createdByUid) {
//           const senderDocRef = doc(db, 'users', createdByUid);
//           const senderSnap = await getDoc(senderDocRef);
//           if (senderSnap.exists()) {
//             const userData = senderSnap.data();
//             senderName = userData.name + ' ' + (userData.surname || '');
//           }
//         }

//         allItems.push({
//           id: docSnap.id,
//           ...data,
//           senderName: senderName.trim(),
//         });
//       }
//       console.log('Returned pending items:', allItems);

//       return allItems;
//     } catch (error) {
//       console.log("getPendingEmail Thunk Error: ", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const listenToPendingInvitation = (userUid) => async (dispatch) => {
  try {
    const invitationQuery = query(
      collection(db, 'lists'),
      where('invitePending', 'array-contains', userUid)
    )

    const unsubscribe = onSnapshot(invitationQuery, async (InvitationSnap) => {
      await processPendingInvitationSnapshot(InvitationSnap, dispatch, userUid);
    })

    return () => {
      unsubscribe()
    }
  } catch (error) {
    console.log('listenToPendingInvitation error: ', error)
  }
}

export const deleteData = createAsyncThunk('/user/deleteData', async (listId, { getState, rejectWithValue, dispatch }) => {
  try {

    if (!listId) {
      console.log("Silinecek liste ID'si bulunamadi.");
      return rejectWithValue("Liste ID'si geçersiz.");
    }

    await deleteDoc(doc(db, 'lists', listId))
    Alert.alert("Successful", "Document deleted successfully.");

    dispatch(setIsEffect())


  } catch (error) {
    console.log('deleteData Thunk error: ', error)
    Alert.alert("Error", "There was a problem deleting the document.");
    return rejectWithValue(error.message)
  }
})

export const handleInvite = createAsyncThunk('/user/handleInvite', async (email, { getState, rejectWithValue, dispatch }) => {
  try {

    const state = getState()
    const currListId = state.trigger.currentListId

    if (!email || email.trim() === '') {
      Alert.alert('Warning', 'Please enter a valid email address.');
      return;
    }

    const docRef = await doc(db, 'lists', currListId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      Alert.alert('error', 'List Not Found, May Have Been Removed')
      return rejectWithValue('List Not Found, May Have Been Removed');
    }

    const questRef = await query(
      collection(db, 'users'),
      where('email', '==', email)
    )

    const questSnap = await getDocs(questRef)

    if (questSnap.empty) {
      Alert.alert('error', 'User Not Found')
      return rejectWithValue('User Not Found');
    }

    const userDoc = questSnap.docs[0];
    const userUid = userDoc.data().userUid;

    updateDoc(docRef, {
      invitePending: arrayUnion(userUid)
    })

    Alert.alert('Success', 'Invitation sent!');
    dispatch(setIsEffect())

    return true
  } catch (error) {
    console.log("InviteFriendBox 'handleInvite' Thunk Error: ", error)
    Alert.alert('Error', "Could Not Be Invited")
  }
}
)

export const inviteAccept = createAsyncThunk('user/inviteAccept', async (itemId, { getState, rejectWithValue, dispatch }) => {
  try {

    const state = getState()
    const userUid = state.user.userUid

    const docRef = doc(db, 'lists', itemId)

    await updateDoc(docRef, {
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

export const inviteReject = createAsyncThunk('user/inviteReject', async (itemId, { getState, rejectWithValue, dispatch }) => {
  try {

    const state = getState()
    const userUid = state.user.userUid

    const docRef = doc(db, 'lists', itemId)

    await updateDoc(docRef, {
      invitePending: arrayRemove(userUid)
    })

    dispatch(setIsEffect())

    return
  } catch (error) {
    console.log('inviteReject Thunk Error:', error);
    return rejectWithValue(error.message);
  }
})

export const addItem = createAsyncThunk('user/listId/addItem', async ({ mission, quantity, listId }, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState();

    await addDoc(collection(db, 'lists', listId, 'items'), {
      mission,
      quantity,
      isBought: false,
      addedBy: state.user.userUid,
      addedAt: serverTimestamp(),
    });

    dispatch(setIsEffect())


  } catch (error) {
    console.log("addItem error: ", error);
    return rejectWithValue(error.message);
  }
}
);

// export const findAllItem = createAsyncThunk('user/listId/findAllItem',async (listId, { rejectWithValue, dispatch }) => {
//     try {
//       const docsSnapshot = await getDocs(collection(db, 'lists', listId, 'items'));

//       const items = [];

//       docsSnapshot.forEach((doc) => {
//         const data = doc.data();
//         items.push({
//           id: doc.id,
//           mission: data.mission,
//           quantity: data.quantity,
//           isBought: data.isBought || false,
//         });
//       });

//       let allItemIsBought = true;
//       if(items.length === 0){
//         allItemIsBought = false 
//       }else{
//         for(const item of items){
//           if(!item.isBought){
//             allItemIsBought = false;
//             break;
//           }
//         }
//       }

//       dispatch(setListBuyStatus({ listId, status: allItemIsBought}))

//       return items;

//     } catch (error) {
//       console.log("findAllItem error: ", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const listenToFindAllItem = (listId) => async(dispatch) => {
  try {
    const itemsCollectionRef = collection(db, 'lists', listId, 'items');

    const unsubscribe = onSnapshot(itemsCollectionRef, async(querySnapshot) => {
      await processFindAllItemSnapshot(querySnapshot, dispatch, listId);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };

  } catch (error) {
    console.log("listenToFindAllItem error: ", error);
  }
}

export const deleteUser = createAsyncThunk('user/listId/deleteUser', async ({ listId, userUid }, { rejectWithValue, dispatch }) => {
  try {
    const docRef = doc(db, 'lists', listId)

    await updateDoc(docRef, {
      sharedWith: arrayRemove(userUid)
    })

    dispatch(setIsEffect())
    return
  } catch (error) {
    console.log("handleDeleteUser Thunk error: ", error)
    return rejectWithValue(error.message)
  }
})

export const deleteItem = createAsyncThunk('user/listId/deleteItem', async ({ listId, itemId }, { rejectWithValue, dispatch }) => {
  try {

    if (!listId) {
      console.log("Silinecek liste ID'si bulunamadi.");
      return rejectWithValue("Liste ID'si geçersiz.");
    }

    await deleteDoc(doc(db, 'lists', listId, 'items', itemId))
    Alert.alert("Successful", "Document deleted successfully.");

    dispatch(setIsEffect())
  } catch (error) {
    console.log("deleteItem Thunk error: ", error)
    Alert.alert("Error", "There was a problem deleting the document.");
    return rejectWithValue(error.message)
  }
})

export const toggleBought = createAsyncThunk('user/listId/toggleBought', async ({ listId, itemId }, { rejectWithValue, dispatch }) => {
  try {

    if (!itemId || !listId) {
      return rejectWithValue("Geçersiz item veya liste ID.");
    }

    const itemRef = doc(db, 'lists', listId, 'items', itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      return rejectWithValue('Item not found');
    }



    const currentStatus = itemSnap.data().isBought || false;

    await updateDoc(itemRef, {
      isBought: !currentStatus,
    });

    dispatch(setIsEffect())

    return { itemId, isBought: !currentStatus };

  } catch (error) {
    console.log("toggleBought error: ", error);
    return rejectWithValue(error.message);
  }
});

export const listenToUserLists = (userUid) => (dispatch) => {
  try {

    const createdByQuery = query(collection(db, 'lists'), where('createdBy', '==', userUid))
    const sharedWithQuery = query(collection(db, 'lists'), where('sharedWith', 'array-contains', userUid))

    const unsubCreated = onSnapshot(createdByQuery, async (createdSnapshot) => {
      await processgetAllDataSnapshot(createdSnapshot, dispatch, userUid);
    })

    const unsubShared = onSnapshot(sharedWithQuery, async (sharedWithSnapshot) => {
      await processgetAllDataSnapshot(sharedWithSnapshot, dispatch, userUid);
    })

    return () => {
      unsubCreated()
      unsubShared()
    }

  } catch (error) {
    console.error("listenToUserLists error:", error);
  }
}

const processgetAllDataSnapshot = async (snapshot, dispatch, currentUserUid) => {
  try {
    const docsArray = snapshot.docs;

    const userUids = new Set();

    docsArray.forEach((doc) => {
      const data = doc.data()
      if (data.createdBy) userUids.add(data.createdBy)
      if (Array.isArray(data.sharedWith)) {
        data.sharedWith.forEach(uid => userUids.add(uid))
      }
    })

    const userPromises = [...userUids].map(uid => getDoc(doc(db, 'users', uid)))
    const userSnapshots = await Promise.all(userPromises)

    const usersMap = {}
    userSnapshots.forEach(user => {
      if (user.exists()) {
        usersMap[user.id] = { uid: user.uid, ...user.data() }
      }
    });


    const combinedData = docsArray.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdByUserData: usersMap[data.createdBy] || {},
        sharedWithUserData: (data.sharedWith || []).map(uid => usersMap[uid]).filter(Boolean),
      };
    });

    dispatch(setAllData(combinedData))

  } catch (error) {
    console.error("processgetAllDataSnapshot error:", error);
  }
}

const processPendingInvitationSnapshot = async (snapshot, dispatch, currentUserUid) => {
  try {
    const docsArray = snapshot.docs;
    const invitations = [];

    for (const docSnap of docsArray) {
      const listData = docSnap.data();
      const createdByUid = listData.createdBy;

      // Fetch sender info
      let senderName = 'Unknown';
      let senderEmail = '';

      if (createdByUid) {
        const senderDoc = await getDoc(doc(db, 'users', createdByUid));
        if (senderDoc.exists()) {
          const senderData = senderDoc.data();
          senderName = `${senderData.name || ''} ${senderData.surname || ''}`.trim();
          senderEmail = senderData.email || '';
        }
      }

      invitations.push({
        id: docSnap.id,
        ...listData,
        senderName,
        senderEmail,
      });
    }

    dispatch(setPendingData(invitations));

  } catch (error) {
    console.error("processPendingInvitationSnapshot error:", error);
  }
}

const processFindAllItemSnapshot = async (snapshot, dispatch, listId) => {
  try {
    const allItems = []

    snapshot.forEach((doc) => {
      const data = doc.data();
      allItems.push({
        id: doc.id,
        mission: data.mission,
        quantity: data.quantity,
        isBought: data.isBought || false,
      });
    })

    const allItemIsBought = allItems.length > 0 && allItems.every(item => item.isBought);

    dispatch(setListBuyStatus({ listId, status: allItemIsBought }))

    allItems.sort((a, b) => {
      const missionCompare = a.mission.localeCompare(b.mission);
      return missionCompare !== 0 ? missionCompare : (a.addedAt - b.addedAt);
    });
    dispatch(setAllItems(allItems))
  } catch (error) {
    console.error("processFindAllItemSnapshot error:", error);
  }
}

const initialState = {
  data: [],
  pendingData: [],
  items: [],
  listBuyStatus: {},
  setData: [],
  isLoading: false,
  error: null,
};

const DataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setAllData: (state, action) => {
      state.data = action.payload;
    },
    setPendingData: (state, action) => {
      state.pendingData = action.payload;
    },
    setAllItems: (state, action) => {
      state.items = action.payload;
    },
    clearItems: (state) => {
      state.items = [];
    },
    setListBuyStatus: (state, action) => {
      const { listId, status } = action.payload
      state.listBuyStatus[listId] = status
    },
    setListNumberOfUsers: (state, action) => {
      const { listId, number } = action.payload
      state.listBuyStatus[listId] = number
    }
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getAllData.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(getAllData.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.data = action.payload;
      // })
      // .addCase(getAllData.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload;
      // })
      // .addCase(getPendingEmail.pending, (state) => {
      //   state.isLoading = true
      // })
      // .addCase(getPendingEmail.fulfilled, (state,action) => {
      //   state.isLoading = false
      //   state.pendingData = action.payload
      // })
      // .addCase(getPendingEmail.rejected, (state,action) => {
      //   state.isLoading = false
      //   state.error = action.payload
      // })
      .addCase(addUsers.rejected, (state, action) => {
        console.log("User ekleme hatası:", action.payload);
        state.error = action.payload; // istersen store’da hata gösterimi için
      })
      .addCase(handleInvite.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(inviteAccept.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(addItem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addItem.fulfilled, (state) => {
        state.isLoading = false
        setIsEffect()
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // .addCase(findAllItem.pending, (state) =>{
      //     state.isLoading = true
      // })
      // .addCase(findAllItem.fulfilled, (state, action) => {
      //     state.isLoading = false;
      //     state.items = action.payload;
      // })
      // .addCase(findAllItem.rejected, (state,action) =>{
      //     state.isLoading = false
      //     state.error = action.payload
      // })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { setAllData, setPendingData, setAllItems, clearItems, setListBuyStatus, setListNumberOfUsers, } = DataSlice.actions;
export default DataSlice.reducer