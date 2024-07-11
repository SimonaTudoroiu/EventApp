import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../../../constants/colors';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, set } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { encode as btoa } from 'base-64';
import IP from '../../../../constants/config';

const Events = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hotEvents, setHotEvents] = useState([]);
    const [categories, setCategories] = useState({});


    const sortEvents = (events) => {
        return events.sort((a, b) => {
            const dateA = new Date(a.end_date);
            const dateB = new Date(b.end_date);
            return dateA < dateB ? 1 : -1;
        });
    };
    
    const checkAdmin = async () => {
        const role = await AsyncStorage.getItem('role');
        setIsAdmin(role === 'administrator');
    };

    const fetchHotEvents = async () => {
        // setLoading(true);
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`http://${IP}:8080/api/event/get-all-event`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                page: 0,
                size: 5,
                sort: 'reserved_spots',
                order: 'DESC'
            }
        });

        return sortEvents(response.data.data);
        // console.log("Hot", response.data.data)
        // setHotEvents(response.data.data);
        // setLoading(false);
    };

    const fetchCategories = async () => {
        // setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`http://${IP}:8080/api/event/find-categories`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
    
            // console.log("Categories", response.data)
            const categories = response.data.data;
            const categoriesData = {};
    
            let allEvents = [];

            for (const category of categories) {
                try {
                    const response2 = await axios.get(`http://${IP}:8080/api/event/get-all-event`, {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        },
                        params: {
                            sort: 'reserved_spots',
                            order: 'DESC',
                            category: category
                        }
                    });
                    console.log(response2.data.data[0].end_date)
                    categoriesData[category] = sortEvents(response2.data.data);
                    allEvents = [...allEvents, ...response2.data.data]; // Append new events to the allEvents array

                } catch (error) {
                    console.error(`Failed to fetch data for category ${category}:`, error);
                    // Poti decide aici dacă dorești să continue bucla sau să marchezi eroarea într-un mod specific
                }
            }
            await AsyncStorage.setItem('events', JSON.stringify(allEvents)); // Serialize data before storing

            // console.log("Categories", categoriesData);
            return categoriesData;
            // setCategories(categoriesData);
            // setLoading(false);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            // setLoading(false);
            // Aici poți trata erori generale legate de obținerea token-ului sau de interogarea categoriilor
        }
    };
    
    const base64Convert = (image) => {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
        return base64String;
    }

    function capitalizeFirstLetter(string) {
        if (!string) return string; // asigură-te că string-ul nu este null sau undefined
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


   
    // UseEffect pentru verificarea statutului de administrator
    // useEffect(() => {
    //     checkAdmin();
    // }, []);

    // UseEffect pentru reîncărcarea datelor când componenta primește focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setLoading(true);
            try {
                const [hotEventsResponse, categoriesResponse] = await Promise.all([
                    fetchHotEvents(),
                    fetchCategories()
                ]);
                setHotEvents(hotEventsResponse);
                setCategories(categoriesResponse);
            } catch (error) {
                console.error('Error loading data:', error);
            }
            setLoading(false);
        });
    
        return unsubscribe;
    }, [navigation]);
    

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const renderItem = ({ item }) => {
        // Verifica daca data de sfarsit a evenimentului este in trecut
        const isPastEvent = new Date(item.end_date) < new Date();
    
        return (
            <TouchableOpacity onPress={() => navigation.navigate('EventDetailed', item.event_id)}>
                <View style={styles.itemContainer}>
                    <Image
                        key={item.name.toString()}
                        source={{ uri: 'data:image/jpeg;base64,' + base64Convert(item.image.data) }}
                        style={styles.image}
                    />
                    {/* Suprapune un View cu background gri semi-transparent pentru evenimentele trecute */}
                    {isPastEvent && (
                        <View style={styles.overlay} />
                    )}
                </View>
                <View style={styles.nameContainer}>
                    <Text style={[styles.textContainer, isPastEvent ? { color: 'grey' } : { color: COLORS.dark }]}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
    
    

    

    return (
        <LinearGradient style={styles.linearGradient} colors={[COLORS.secondary, COLORS.primary]}>
            <View style={styles.titleContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Menu")} style={[styles.iconTouch, styles.leftIcon]}>
                    <Ionicons name="menu" size={50} color={COLORS.pink} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Events</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Account")} style={[styles.iconTouch, styles.rightIcon]}>
                    <FontAwesome5 name="user-circle" size={40} color={COLORS.pink} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                {/* <FlatList
                    style={styles.listStyle}
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.event_id.toString()}
                /> */}
                <KeyboardAwareScrollView style={{marginVertical: 30}}>
                <Text style={styles.title}>Hot</Text>
                <FlatList
                    horizontal
                    data={hotEvents}
                    keyExtractor={item => item.event_id.toString()}
                    renderItem={renderItem}
                />
                {Object.keys(categories).map(category => (
                    <View key={category}>
                        <Text style={styles.title}>{capitalizeFirstLetter(category)}</Text>
                        <FlatList
                            horizontal
                            data={categories[category]}
                            keyExtractor={item => item.event_id.toString()}
                            renderItem={renderItem}
                        />
                    </View>
                ))}
                </KeyboardAwareScrollView>
            </View>
            {/* {isAdmin && (
                <TouchableOpacity onPress={() => console.log('Post Event')} style={styles.addButton}>
                    <FontAwesome5 name="plus-square" size={50} color={COLORS.pink} />
                </TouchableOpacity>
            )} */}
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
    addButton: {
        position: 'absolute',  // Poziționează elementul în mod absolut relativ la containerul său părinte
        padding: 10,  // Adaugă padding pentru a mări zona de apăsare
        right: 10,  // Aliniază elementul la marginea dreaptă a containerului părinte
        bottom: 10,  // Aliniază elementul la marginea de jos a containerului părinte
    },    
    leftIcon: {
        left: 20,
    },
    rightIcon: {
        right: 20,
    },
    titleText: {
        fontSize: 50,
        fontWeight: '800',
        color: COLORS.pink,
        textAlign: 'center',
        zIndex: 5,
    },
    title :{
        fontSize: 40,
        fontWeight: '700',
        color: COLORS.dark,
        zIndex: 5,
        padding: 10,
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
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        // padding: 10,
        borderColor: COLORS.blue,
        borderWidth: 2,
        width: 200,
        height: 100,
    },
    nameContainer: {
        flex: 0,
        // marginVertical: 5,
        marginHorizontal: 10,
        // backgroundColor: COLORS.pink,
        borderRadius: 10,
        // padding: 10,
    },
    nameText: {
        fontSize: 25,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
        color: COLORS.dark,
    },
    textContainer: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        flex: 1,
    },
    listStyle: {
        flex: 1,
        padding: 10,
        marginTop: 10,
        marginBottom: 100,  // Ajustează această valoare după necesități
    },
    image: {
        width: '100%',
        height: '100%',
        marginRight: 10,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Face overlay-ul să acopere complet imaginea
        backgroundColor: 'rgba(128, 128, 128, 0.5)', // Fundal gri semi-transparent
    },
    // Restul stilurilor

});

export default Events;
