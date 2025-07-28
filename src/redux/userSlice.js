import React, { } from 'react';
import { createAsyncThunk, createSlice,  } from "@reduxjs/toolkit"; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const LogIn = createAsyncThunk('/logIn',async({name,surname,email,password}, {rejectWithValue})=>{
  try {
    const userCredential = await  signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const token = await user.getIdToken()

    const userData = {
      token,
      userUid: user.uid, 
      user: { 
        name: name,
        surname: surname,
        email: user.email,
      },
    };

    await AsyncStorage.setItem('userToken', token); 
    await AsyncStorage.setItem('userUid', user.uid); 

    return userData;
  } catch (error) {
    console.log("logIn Thunk Error:", error);
    return rejectWithValue(error.message); 
  }
})

export const autoLogIn = createAsyncThunk('/autoLogIn', async(_ , {rejectWithValue})=>{
  try {
   // console.log('await onu')
    const token = await AsyncStorage.getItem('userToken');
    const uid = await AsyncStorage.getItem('userUid')
  //console.log('await sonrasi')

    if(token && uid) return {token, uid};
    else {return  rejectWithValue('token yok')}
  } catch (error) {
    console.log(`autoLogIn thunk error: `, error)
    return rejectWithValue(error.message)
  }
})

export const SignUp = createAsyncThunk('/SignUp', async({ email, password, name, surname }, {rejectWithValue }) => {
  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const token = await user.getIdToken()

    const userData = {
      user: { 
        name: name,
        surname: surname,
        email: user.email,
        uid: user.uid,
        token
      },
    };

    await AsyncStorage.setItem('userToken', token); 
    await AsyncStorage.setItem('userUid', user.uid); 

    return userData;
  } catch (error) {
    console.log("SignUp Thunk Error:", error);
    return rejectWithValue(error.message)
  }
})

export const LogOut = createAsyncThunk('/LogOut', async(_, { rejectWithValue})=>{
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userUid'); 
    return null;
  } catch (error) {
    console.log('logOut Thunk Error:', error);
    return rejectWithValue(error.message);
  }
})



const initialState = {
  isLoading: false,
  isAuthenticated: false, 
  token: null,
  user: null, 
  userUid: null, 
  error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setAuthInfo: (state, action) => {
          state.userUid = action.payload.userUid
          state.token = action.payload.token
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(LogIn.pending,(state) => {
          state.isLoading = true
        })
        .addCase(LogIn.fulfilled,(state,action) => {
          state.isLoading = false
          state.isAuthenticated = true
          state.token = action.payload.token
          //console.log(`LoginToken: `, state.token)
          state.userUid = action.payload.userUid
          state.user = action.payload.user
        })
        .addCase(LogIn.rejected,(state, action) => {
          state.isLoading = false
          state.isAuthenticated = false
          state.token = null
          state.user = null
          state.userUid = null
          state.error = action.payload
        })
        .addCase(autoLogIn.pending,(state) => {
          state.isLoading = true;
          state.error = null;
          //console.log('autopending takildi')
        })
        .addCase(autoLogIn.fulfilled,(state,action) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.userUid = action.payload.uid;
          //console.log(`autoLoginToken: `, state.token)
          //console.log('autoLogIn.fullfilled girdi ')
        })
        .addCase(autoLogIn.rejected,(state,action) => {
          state.isLoading = false;
          state.isAuthenticated = false;
          state.error = action.payload; 
          state.token = null;
          state.userUid = null;
          //console.log('autoLogIn.rejected girdi ')
        })
        .addCase(SignUp.pending,(state) => {
          state.isLoading = true
          //console.log("pending girdi")
        })
        .addCase(SignUp.fulfilled,(state,action) => {
          state.isLoading = false
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
          state.userUid = action.payload.uid
          //console.log("fullfilled girdi")
        })
        .addCase(SignUp.rejected,(state,action) => {
          state.isLoading = false
          state.isAuthenticated = false
          state.token = null
          state.user = null
          state.userUid = null
          state.error = action.payload
          //console.log("rejected girdi")
        })
        .addCase(LogOut.pending,(state) =>{
          state.isLoading = true
        })
        .addCase(LogOut.fulfilled,(state) =>{
          state.isAuthenticated = false
          state.isLoading = false
          state.token = null
          state.user = null
          state.userUid = null
          state.error = null
        })
        .addCase(LogOut.rejected,(state,action) =>{
          state.isLoading = false
          state.error = action.payload
        })
    }
})

export const { setAuthInfo } = userSlice.actions
export default userSlice.reducer;