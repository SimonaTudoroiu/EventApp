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

const Reservation = ({ navigation, route }) => {
    const event_id = route.params;
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [description, setDescription] = useState('');


    const handleSubmit = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            const num_of_seats = parseInt(numberOfPeople);
            const response = await axios.post(`http://${IP}:8080/api/reservation/save-reservation`,{
                event_id,
                num_of_seats,
                description
            }, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            console.log('Response from server:', response.data);
            alert('Reservation made successfully!');
            navigation.navigate("Events");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to make reservation!");
            }
            console.error('Error submitting form:', error);    

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
                <Text style={styles.titleText}>Reserve Now</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8,
                        color: COLORS.dark
                    }}>How many people?</Text>

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
                            placeholder='Enter the number of people'
                            value={numberOfPeople.toString()}
                            onChangeText={setNumberOfPeople}
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
                    }}>Special Requests</Text>

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
                            placeholder='Enter your special requests, if any'
                            value={description}
                            onChangeText={setDescription}
                            placeholderTextColor={COLORS.dark}
                            keyboardType='default'
                            style={{
                                width: "100%"
                            }}
                        />

                        
                    </View>
                </View>

                

                <Button
                    title="Reserve"
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
        color: COLORS.blue,
        textAlign: 'center',
        zIndex: 5,
    },
})
export default Reservation