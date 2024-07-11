import { View, Text, Image , Pressable, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../../../../../constants/colors';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../../../../../components/button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../../../../../constants/config';

const DeleteLocation = ({ navigation, route }) => {
    const location_id = route.params;
    const [notification, setNotification] = useState('');


    const handleSubmit = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.delete(`http://${IP}:8080/api/location/delete-location`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                params: {
                    id: location_id
                }
            });
            console.log('Response from server:', response.data);
            alert("Location deleted successfully!");
            navigation.navigate("AdminLocations");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to delete location!");
            }
            console.error('Failed to delete location:', error);
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
                <Text style={styles.titleText}>Delete Location</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>Are you sure you want to delete this location?</Text>
                </View>
                <Button
                    title="Yes"
                    onPress={handleSubmit}
                    filled
                    style={{
                        marginTop: 30,
                        marginBottom: 4,
                        width: "80%",
                        marginHorizontal: 40
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
    itemContainer: {
        padding: 10,
        marginVertical: 10,
        alignContent: 'center',
        alignItems: 'center'
    },
    itemText: {
        fontSize: 17,
        color: COLORS.dark,
        fontWeight: '600'
    },
})
export default DeleteLocation;