import { ScrollView, View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
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

const NamePage = ({ navigation, route}) => {
    const { email, password } = route.params;

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    
    const handleSubmit = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');

            const response = await axios.put(`http://${IP}:8080/api/admin/update`, {
                first_name,
                last_name,
                email,
                password,
            },
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            }, {
                timeout: 10000,
            });
            
            console.log('Response from server:', response.data);
            alert("Sign up successful!");
            AsyncStorage.getItem('accessToken').then(token => {console.log(token)});
            navigation.navigate('AdminEvents');
            // Puteți face ceva cu răspunsul aici
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to finish sign up!");
            }
            console.error('Error submitting form:', error);
    
            // Puteți trata eroarea aici
        }
        
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavander }}>
            <KeyboardAwareScrollView>

            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: COLORS.black
                    }}>
                        Please enter your first name and your last name
                    </Text>

                    
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>First Name</Text>

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
                            placeholder='Enter your first name'
                            value={first_name}
                            onChangeText={setFirstName}
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
                    }}>Last Name</Text>

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
                            placeholder='Enter your last name'
                            value={last_name}
                            onChangeText={setLastName}
                            placeholderTextColor={COLORS.black}
                            keyboardType='default'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>

                <Button
                    title="Finish sign Up"
                    onPress={handleSubmit}
                    filled
                    style={{
                        marginTop: 350,
                        marginBottom: 4,
                    }}
                />

                
                
                <Button 
                    title="Back" 
                    filled= {true}
                    onPress={() => navigation.goBack()} 
                    style={{
                        marginTop: 50,
                        width: "100%",
                    }}
                />
            </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default NamePage