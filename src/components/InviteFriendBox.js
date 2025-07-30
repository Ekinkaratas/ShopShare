import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInviteFriendBox, setCurrentListId } from '../redux/TriggerSlice'
import CustomTextInput from './CustomTextInput'
import CustomButton from './CustomButton'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'

const InviteFriendBox = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const currListId = useSelector((state) => state.trigger.currentListId);


    const handleInvite = async() => {
        try {
            
            console.log('email: ', email)

            if (!email || email.trim() === '') {
                Alert.alert('Warning', 'Please enter a valid email address.');
                return;
            }

            const docRef = await doc(db,'lists', currListId)

            updateDoc(docRef,{
                invitePending: arrayUnion(email)
            })

            Alert.alert('Success', 'Invitation sent!');
            setEmail('');
        } catch (error) {
            console.log("InviteFriendBox 'handleInvite' Thunk Error: ", error)
            Alert.alert('Error',"Could Not Be Invited")
        }
    }
    
  return (
    <Pressable
    style={styles.InviteContainer}
    onPress={() => {dispatch(setInviteFriendBox(false))}}
    >
        <Pressable
        style = {styles.popupBox}
        onPress={(e) => {e.stopPropagation()}}
        >
            <CustomTextInput 
                title={"Enter the email address of the person you want to invite."}
                handlePlaceHolder={"Enter Your Email Adress..."}
                handleMod={"email"}
                handleSecurityText={false}
                handleValue={email}
                HandleOnChange={(value) => setEmail(value)}
                handleTitleColor={'#34495e'}
            />
            
            <CustomButton
                title={'Sent Invite'}
                HandleonPress={handleInvite}
                handleWidth={'80%'}
                handleBackground={'#2c3e50'}
                handleTextColor={'#ecf0f1'}
            />
        </Pressable>
    </Pressable>
  )
}

export default InviteFriendBox

const styles = StyleSheet.create({
    InviteContainer:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
        popupBox: {
        width: 300,
        height: 250,
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
})