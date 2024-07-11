import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../../../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, set } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { encode as btoa } from 'base-64';
import { render } from 'react-native-web';


const Menu = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
   
    
    const logout = async () => {
        try{
            await AsyncStorage.clear();
            navigation.navigate('Welcome');
        }
        catch (error) {
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
                <Text style={styles.titleText}>Menu</Text>
                
            </View>
            <View style={styles.bottomContainer}>
                <KeyboardAwareScrollView style={{marginVertical: 30}}>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("Events")}>
                        <Text style={styles.itemText}> Home Page</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("UserMap")}>
                        <Text style={styles.itemText}> See Events Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("UserCalendar")}>
                        <Text style={styles.itemText}> Your Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("UserEvents")}>
                        <Text style={styles.itemText}> Your Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("ContactApp")}>
                        <Text style={styles.itemText}> Contact Us</Text>
                    </TouchableOpacity>
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
        fontSize: 50,
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
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey,
        marginVertical: 10,
        alignContent: 'center',
        alignItems: 'left'
    },
    itemText: {
        fontSize: 30,
        color: COLORS.dark,
        fontWeight: '600'
    },
});

export default Menu;
