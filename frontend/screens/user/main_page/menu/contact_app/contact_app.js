import { View, Text, Image , Pressable, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../../../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../../../../components/button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../../../../constants/config';
import { AntDesign } from '@expo/vector-icons';

const ContactApp = ({ navigation, route }) => {
    const event_id = route.params;
    const [email, setEmail] = useState('');
    const [problem, setProblem] = useState('');


    const handleSubmit = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.post(`http://${IP}:8080/api/contact/send-email`,{
                email,
                message: problem
            }, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            console.log('Response from server:', response.data);
            alert('Email sent successfully!');
            navigation.goBack();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to send email!");
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
                    <AntDesign name="left" size={40} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Contact Us</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email</Text>

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
                            keyboardType='default'
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
                    }}>Problem</Text>

                    <View style={{
                        width: "100%",
                        height: 200,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Tell us about your problem'
                            value={problem}
                            onChangeText={setProblem}
                            placeholderTextColor={COLORS.black}
                            keyboardType='default'
                            multiline={true}
                            numberOfLines={4}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />

                        
                    </View>
                </View>

                

                <Button
                    title="Submit"
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
        fontSize: 40,
        fontWeight: '800',
        color: COLORS.dark,
        textAlign: 'center',
        zIndex: 5,
    },
})
export default ContactApp;