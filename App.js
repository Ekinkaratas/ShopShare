import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigation from './src/navigation/RootNavigation.js';
import { store }  from './src/redux/store.js'
import { Provider, useDispatch } from 'react-redux';
import { onAuthStateChanged,  } from 'firebase/auth';
import { auth, } from './config/firebaseConfig.js';
import { setAuthInfo } from './src/redux/userSlice.js';


function AppContent() {
  const dispatch = useDispatch()
  useEffect(() =>{
    

    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const idToken = await user.getIdToken(); 

        dispatch(setAuthInfo({ userUid: uid, token: idToken }));
      } else {
        dispatch(setAuthInfo({ uid: null, token: null })); 
      }
    });
    return subscriber;
  }, [dispatch]);

    return <RootNavigation />
} 

export default function App() {
  return (
      <Provider store = {store}>
        <AppContent />
      </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
