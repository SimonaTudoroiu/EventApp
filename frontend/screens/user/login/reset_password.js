import { View, Text, Image , Pressable, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../../constants/colors';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../../components/button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../../constants/config';

const ResetPassword = ({ navigation}) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async () => {
        try{
            const response = await axios.post(`http://${IP}:8080/api/users/reset-password`,{
                email,
                token: code, 
                password
            });
            console.log('Response from server:', response.data);
            alert('Password reset successfully!');
            navigation.navigate("Login");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to sent email!");
            }
            console.error('Error submitting form:', error);    

        }

        

    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.pink }}>
            <KeyboardAwareScrollView>
            <View style={styles.titleContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={[styles.iconTouch, styles.leftIcon, { padding: 30 }]}
                    >
                    <AntDesign name="left" size={40} color={COLORS.blue} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Reset Password</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8,
                        color: COLORS.dark
                    }}>Email</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.dark,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your email'
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor={COLORS.dark}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                        />

                        
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8,
                        color: COLORS.dark
                    }}>Code</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.dark,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter the code from the mail'
                            value={code}
                            onChangeText={setCode}
                            placeholderTextColor={COLORS.dark}
                            keyboardType='number-pad'
                            style={{
                                width: "100%"
                            }}
                        />

                        
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8,
                        color: COLORS.dark
                    }}>New Password</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.dark,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your new password'
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor={COLORS.dark}
                            keyboardType='default'
                            style={{
                                width: "100%"
                            }}
                        />

                        
                    </View>
                </View>

                

                <Button
                    title="Reset Password"
                    onPress={handleSubmit}
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                />

                

            </View>
            
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        position: 'relative',
    },
    iconTouch: {
        position: 'absolute',
        padding: 10,
    },
    leftIcon: {
        left: -10,
    },
    titleText: {
        fontSize: 30,
        fontWeight: '700',
        color: COLORS.blue,
        textAlign: 'center',
        zIndex: 5,
    },
})
export default ResetPassword;