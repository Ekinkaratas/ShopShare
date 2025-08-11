import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import CustomTextInput from '../components/CustomTextInput.js';
import CustomButton from '../components/CustomButton.js';
import CustomTextInputForPassword from '../components/CustomTextInputForPassword.js';
import { useSelector, useDispatch } from 'react-redux';
import { SignUp } from '../redux/userSlice.js';
import Loading from '../components/Loading.js';

const RegisterPage = ({ navigation }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state.user);

    const handleRegister = () => {
        if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        dispatch(SignUp({ name, surname, email, password }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.contentWrapper}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join us to get started</Text>

                    <View style={styles.formContainer}>
                        <CustomTextInput
                            title={"Name"}
                            handlePlaceHolder={"Enter Your Name"}
                            handleMod={"default"}
                            handleSecurityText={false}
                            handleValue={name}
                            HandleOnChange={(value) => setName(value)}
                            handleTitleColor={'#34495e'}
                        />

                        <CustomTextInput
                            title={"Surname"}
                            handlePlaceHolder={"Enter Your Surname"}
                            handleMod={"default"}
                            handleSecurityText={false}
                            handleValue={surname}
                            HandleOnChange={(value) => setSurname(value)}
                            handleTitleColor={'#34495e'}
                        />

                        <CustomTextInput
                            title={"Email"}
                            handlePlaceHolder={"Enter Your Email"}
                            handleMod={"email"}
                            handleSecurityText={false}
                            handleValue={email}
                            HandleOnChange={(value) => setEmail(value)}
                            handleTitleColor={'#34495e'}
                        />

                        <CustomTextInputForPassword
                            title={"Password"}
                            handlePlaceHolder={"Enter Your Password"}
                            handleMod={"default"}
                            handleSecurityText={true}
                            handleValue={password}
                            HandleOnChange={(value) => setPassword(value)}
                            handleTitleColor={'#34495e'}
                        />

                        <CustomButton
                            title={'Sign Up'}
                            HandleonPress={handleRegister}
                            handleWidth={'80%'}
                            handleBackground={'#2c3e50'}
                            handleTextColor={'#ecf0f1'}
                        />
                    </View>

                    <View style={styles.loginPromptContainer}>
                        <Text style={styles.loginPromptText}>Already have an account?</Text>
                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLinkText}>Click here to login</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {isLoading && <Loading />}
        </SafeAreaView>
    );
};

export default RegisterPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ecf0f1",
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentWrapper: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        paddingVertical: 30,
        paddingHorizontal: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 30,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
    },
    loginPromptContainer: {
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: '#ecf0f1',
        width: '100%',
    },
    loginPromptText: {
        fontSize: 14,
        color: '#34495e',
        marginBottom: 8,
    },
    loginLinkText: {
        fontSize: 15,
        color: '#2980b9',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});