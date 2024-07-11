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


const EmailPage = ({ navigation }) => {
    
    const [email, setEmail] = useState('');


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
                        Welcome! 
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
                    <Text style={{ fontSize: 16, color: COLORS.black }}>On the next page, upload all the photos necessary to prove your identity as an administrator.</Text>
                </View>

                <Button
                    title="Next"
                    onPress={() => navigation.navigate("AdministratorCameraPage", { email } )}
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
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("LoginAdmin")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>
            <Button 
                title="Back" 
                filled= {true}
                onPress={() => navigation.goBack()} 
                style={{
                    marginTop: 350,
                    width: "90%",
                    marginHorizontal:20
                }}
            />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default EmailPage