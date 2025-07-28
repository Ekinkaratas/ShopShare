import React from 'react';
import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from "./userSlice.js" 
import DataSlice from './DataSlice.js';

export const store = configureStore({
    reducer:{
       user: userSlice,
       userData: DataSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false})
})

export default store;