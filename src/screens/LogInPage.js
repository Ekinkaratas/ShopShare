import React, { useState, useEffect } from 'react';
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
import { LogIn, autoLogIn } from '../redux/userSlice.js';
import Loading from '../components/Loading.js';

const LogInPage = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(autoLogIn());
    }, []);

    const { isLoading } = useSelector(state => state.user);

    const handleLogin = () => {
        if (email.trim() === '' || password.trim() === '') {
            alert('Lütfen e-posta ve şifrenizi girin.');
            return;
        }
        dispatch(LogIn({ email, password }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.contentWrapper}>

                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.subtitle}>Continue by logging in</Text>

                    <View style={styles.formContainer}>
                        <CustomTextInput
                            title={"Email"}
                            handlePlaceHolder={"Enter Your Email Adress"}
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
                            title={'Log In'}
                            HandleonPress={handleLogin}
                            handleWidth={'80%'}
                            handleBackground={'#2c3e50'}
                            handleTextColor={'#ecf0f1'}
                        />
                    </View>

                    <View style={styles.registerPromptContainer}>
                        <Text style={styles.registerPromptText}> Don't have an account yet?</Text>
                        <Pressable onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLinkText}>Click here to create an account</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {
                isLoading
                    ? <Loading />
                    : null
            }
        </SafeAreaView>
    );
};

export default LogInPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ecf0f1", // Eski versiyondaki açik gri arka plan
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
        backgroundColor: '#ffffff', // Beyaz kart arka planı
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
        color: '#2c3e50', // Eski koyu gri/lacivert ana renk
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d', // Daha nötr bir gri tonu
        marginBottom: 30,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
    },
    registerPromptContainer: {
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: '#ecf0f1', // Çok açık gri çizgi
        width: '100%',
    },
    registerPromptText: {
        fontSize: 14,
        color: '#34495e', // Koyu gri metin
        marginBottom: 8,
    },
    registerLinkText: {
        fontSize: 15,
        color: '#2980b9', // Eski versiyondaki mavi link rengi
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});