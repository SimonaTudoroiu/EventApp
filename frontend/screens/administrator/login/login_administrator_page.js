import { View, Text, Image , Pressable, TextInput, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../../components/button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../../constants/config';

const LoginAdmin = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userRole, setUserRole] = useState(null);

    const [adminStatus, setAdminStatus] = useState(null);

    const handleSubmit = async () => {
        axios.post(`http://${IP}:8080/api/admin/login`, {
            email,
            password,
        }, {
            timeout: 10000,
        })
        .then(response => {
            console.log('Response from server:', response.data);
            AsyncStorage.setItem('accessToken', response.data.accessToken).catch(error => {
                console.error('Error setting access token:', error);
            });
            AsyncStorage.setItem('role', "administrator");
            console.log("Status", response.data.status)
            setAdminStatus(response.data.status);
            if(response.data.status === "pending" )
                navigation.navigate("PasswordPage", {email: email});
            else if(response.data.status === "approved")
                navigation.navigate("AdminEvents");
            // Puteți face ceva cu răspunsul aici
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to login!");
            }
            console.error('Error submitting form:', error);
    
        // Puteți trata eroarea aici
        });

        

    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavander }}>
            <KeyboardAwareScrollView>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Welcome Back ! 
                    </Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email address</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your email address'
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor={COLORS.black}
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
                        marginVertical: 8
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your password'
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={!isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                

                <Button
                    title="Login"
                    onPress={handleSubmit}
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                />

                

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Don't have an account ? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("EmailPage")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Request an account</Text>
                    </Pressable>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Forgot your password? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("ForgotPasswordAdmin")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Yes</Text>
                    </Pressable>
                </View>
            </View>
            <Button 
                title="Back" 
                filled= {true}
                onPress={() => navigation.goBack()} 
                style={{
                    marginTop: 300,
                    width: "90%",
                    marginHorizontal:20
                }}
            />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default LoginAdmin