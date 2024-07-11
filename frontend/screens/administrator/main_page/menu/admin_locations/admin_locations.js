import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../../../../constants/colors';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, set } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { encode as btoa } from 'base-64';
import { render } from 'react-native-web';
import  IP  from '../../../../../constants/config';

const AdminLocations = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const fetchLocations = async () => {
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`http://${IP}:8080/api/location/get-all-locations`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            // console.log("Categories", response.data)
            const locations = response.data.data;
            console.log("Locations", locations);
            setLocations(locations);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
        setLoading(false);
    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate("LocationDetailed", item.location_id)}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{item.name}</Text>
                </View>
                
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchLocations();
        });

        return unsubscribe;
    }, [navigation]);


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
                <Text style={styles.titleText}>Locations</Text>
                <TouchableOpacity   
                    onPress={() => navigation.navigate("AddLocation")}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                    style={[styles.iconTouch, styles.rightIcon, {padding:30}]}  // Mărește zona de atingere fizic
                >
                    <FontAwesome6 name="add" size={40} color={COLORS.pink} />
                </TouchableOpacity>
                
            </View>
            <View style={styles.bottomContainer}>
                <View style={{marginVertical: 30}}>
                    <FlatList
                        data={locations}
                        keyExtractor={item => item.location_id.toString()}
                        renderItem={renderItem}
                    />
                </View>
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
    rightIcon: {
        right: 0,
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

export default AdminLocations;
