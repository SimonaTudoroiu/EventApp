import { View, Text, Image , Pressable, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../../../../constants/colors';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../../../../components/button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../../../../constants/config';

const AddNotification = ({ navigation, route }) => {
    const event_id = route.params;
    const [notification, setNotification] = useState('');


    const handleSubmit = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.post(`http://${IP}:8080/api/notification/save-notification`,{
                event_id,
                message: notification
            }, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            console.log('Response from server:', response.data);
            alert("Notification added successfully");
            navigation.goBack();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to add notification");
            }
            // console.error('Failed to update event:', error);
        }

        

    };

    const renderPageBasedOnRole = () => {
        switch (userRole) {
          case 'general_admin':
            return "GeneralAdminPage";
          case 'user':
            return "Events";
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
                <Text style={styles.titleText}>Add Notification</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8,
                        color: COLORS.dark
                    }}>Message</Text>

                    <View style={{
                        width: "100%",
                        height: 200,
                        borderColor: COLORS.dark,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your notification message'
                            value={notification}
                            onChangeText={setNotification}
                            placeholderTextColor={COLORS.dark}
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
                    title="Add"
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
        fontWeight: '800',
        color: COLORS.blue,
        textAlign: 'center',
        zIndex: 5,
    },
})
export default AddNotification;