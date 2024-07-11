import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../../../../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, set } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Button from '../../../../../components/button';
import IP from '../../../../../constants/config';

const DeleteAccount = ({ navigation }) => {
   
    const handleSubmit = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.delete(`http://${IP}:8080/api/users/delete`,{
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            console.log('Response from server:', response.data);
            alert('Account deleted successfully!');
            navigation.navigate("Welcome");
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to delete account!");
            }
            console.error('Error submitting form:', error);
    
        }
    }
    return (
        <LinearGradient style={styles.linearGradient} colors={[COLORS.secondary, COLORS.primary]}>
            <View style={styles.titleContainer}>
                <TouchableOpacity   
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                    style={[styles.iconTouch, styles.leftIcon, {padding:30}]}  // Mărește zona de atingere fizic
                >
                     <AntDesign name="left" size={40} color={COLORS.pink} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Delete Account</Text>
                
            </View>
            <View style={styles.bottomContainer}>
                <KeyboardAwareScrollView style={{marginVertical: 30}}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>Are you sure you want to delete your account?</Text>
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
                </KeyboardAwareScrollView>
            </View>
            
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        position: 'relative',
    },
    iconTouch: {
        position: 'absolute',
        padding: 10,
    },  
    leftIcon: {
        left:0,
    },
    titleText: {
        fontSize: 35,
        fontWeight: '800',
        color: COLORS.pink,
        textAlign: 'center',
        zIndex: 5,
    },
    bottomContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        marginTop: 150,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingBottom: 125
    },
    itemContainer: {
        padding: 10,
        marginVertical: 10,
        alignContent: 'center',
        alignItems: 'center'
    },
    itemText: {
        fontSize: 16,
        color: COLORS.dark,
        fontWeight: '600'
    },
});

export default DeleteAccount;
