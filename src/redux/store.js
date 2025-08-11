import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from "./userSlice.js" 
import DataSlice from './DataSlice.js';
import TriggerSlice from './TriggerSlice.js';

export const store = configureStore({
    reducer:{
       user: userSlice,
       userData: DataSlice,
       trigger: TriggerSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false})
})

export default store;