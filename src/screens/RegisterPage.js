import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, Text,  } from "react-native"
import CustomTextInput from '../components/CustomTextInput.js';
import CustomButton from '../components/CustomButton.js';
import CustomTextInputForPassword from '../components/CustomTextInputForPassword.js';
import { useSelector, useDispatch } from 'react-redux';
import { SignUp } from '../redux/userSlice.js';
import Loading from '../components/Loading.js';

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    
    const dispatch = useDispatch()
    
    const { isLoading } = useSelector(state => state.user)


    return(
        <SafeAreaView style = {styles.container}>
                <CustomTextInput 
                    title= {"Name"}
                    handlePlaceHolder={"Enter Your Name."}
                    handleMod={"default"}
                    handleSecurityText={false}
                    handleValue={name}
                    HandleOnChange={(value) => setName(value)}
                    handleTitleColor={'#34495e'}
                />
                
                <CustomTextInput 
                    title= {"Surname"}
                    handlePlaceHolder={"Enter Your Surname."}
                    handleMod={"default"}
                    handleSecurityText={false}
                    handleValue={surname}
                    HandleOnChange={(value) => setSurname(value)}
                    handleTitleColor={'#34495e'}
                />

                <CustomTextInput 
                    title= {"Email"}
                    handlePlaceHolder={"Enter Your Email."}
                    handleMod={"email"}
                    handleSecurityText={false}
                    handleValue={email}
                    HandleOnChange={(value) => setEmail(value)}
                    handleTitleColor={'#34495e'}
                />

                <CustomTextInputForPassword 
                    title= {"Password"}
                    handlePlaceHolder={"Enter Your Password."}
                    handleMod={"default"}
                    handleSecurityText={true}
                    handleValue={password}
                    HandleOnChange={(value) => setPassword(value)}
                    handleTitleColor={'#34495e'}
                />

                <CustomButton
                    title = {'Sign Up'}
                    HandleonPress={() =>{
                        dispatch(SignUp({name,surname,email,password}))
                    }}
                    handleWidth = {'35%'}
                    handleBackground={'#2c3e50'}
                    handleTextColor={'#ecf0f1'}
                />

                {
                    isLoading
                    ? <Loading/>
                    : null
                }
           
        </SafeAreaView>
    )
}
export default RegisterPage;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})