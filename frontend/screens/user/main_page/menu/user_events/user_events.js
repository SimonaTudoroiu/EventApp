import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../../../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import axios from 'axios';
import IP from '../../../../../constants/config';

const UserEvents = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [activeEvents, setActiveEvents] = useState([]);
    const [inactiveEvents, setInactiveEvents] = useState([]);
    const [showActive, setShowActive] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`http://${IP}:8080/api/user-calendar/get-events`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            // console.log("Categories", response.data)
            const events = response.data.data;
            console.log("Events", events);
            // const events = await fetchMockEvents();
            const active = events.filter(event => new Date(event.end_date) > new Date());
            const inactive = events.filter(event => new Date(event.end_date) <= new Date());
            setActiveEvents(active);
            setInactiveEvents(inactive);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to fetch events!");
            }
            console.error('Error submitting form:', error);
    
        }
        setLoading(false);
    };

    const base64Convert = (image) => {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
        return base64String;
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchEvents();
        });

        return unsubscribe;
    }, [navigation]);

    const fetchMockEvents = async () => {
        return [
            { event_id: 1, name: 'Event Active 1', end_date: '2024-12-31', image: { data: 'your_base64_image_data_here' } },
            { event_id: 2, name: 'Event Inactive 1', end_date: '2020-01-01', image: { data: 'your_base64_image_data_here' } }
        ];
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            const eventEndDate = new Date(item.end_date);
            if (eventEndDate <= new Date()) {
                // Navighează la pagina de review pentru evenimentele inactive
                navigation.navigate('EventReview',  item.event_id );
            } else {
                // Navighează la pagina de detalii pentru evenimentele active
                navigation.navigate('EventDetailed', item.event_id );
            }
        }}>
            <View style={styles.itemContainer}>
                <Image
                    source={{ uri: 'data:image/jpeg;base64,' + base64Convert(item.image.data) }}
                    style={styles.image}
                />
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    // const renderItem = ({ item }) => (
    //     <TouchableOpacity
    //         onPress={() => {
    //             const eventEndDate = new Date(item.end_date);
    //             if (eventEndDate <= new Date()) {
    //                 // Navighează la pagina de review pentru evenimentele inactive
    //                 navigation.navigate('EventReview', { eventId: item.event_id });
    //             } else {
    //                 // Navighează la pagina de detalii pentru evenimentele active
    //                 navigation.navigate('EventDetailed', { eventId: item.event_id });
    //             }
    //         }}
    //     >
    //         <View style={styles.itemContainer}>
    //             <Image
    //                 source={{ uri: 'data:image/jpeg;base64,' + base64Convert(item.image.data) }}
    //                 style={styles.image}
    //             />
    //             <Text style={styles.nameText}>{item.name}</Text>
    //         </View>
    //     </TouchableOpacity>
    // );
    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <LinearGradient style={styles.linearGradient} colors={[COLORS.secondary, COLORS.primary]}>
        <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[styles.iconTouch, styles.leftIcon, { padding: 30 }]}
            >
              <AntDesign name="left" size={40} color={COLORS.pink} />
            </TouchableOpacity>
            <Text style={styles.titleText}>Your Events</Text>
        </View>
        <View style={styles.bottomContainer}>
            {/* <FlatList
                style={styles.listStyle}
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.event_id.toString()}
            /> */}
            <View style={{marginVertical: 30}}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, showActive ? styles.buttonActive : styles.buttonInactive]}
                    onPress={() => setShowActive(true)}
                >
                    <Text style={styles.buttonText}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, !showActive ? styles.buttonActive : styles.buttonInactive]}
                    onPress={() => setShowActive(false)}
                >
                    <Text style={styles.buttonText}>Inactive</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={showActive ? activeEvents : inactiveEvents}
                renderItem={renderItem}
                keyExtractor={item => item.event_id.toString()}
            />
            </View>
        </View>
        {/* {isAdmin && (
            <TouchableOpacity onPress={() => console.log('Post Event')} style={styles.addButton}>
                <FontAwesome5 name="plus-square" size={50} color={COLORS.pink} />
            </TouchableOpacity>
        )} */}
    </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
    },
    button: {
        padding: 10,
        marginHorizontal: 10,
    },
    buttonActive: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.pink,
    },
    buttonInactive: {
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    buttonText: {
        fontSize: 30,
        fontWeight: '600',
        color: COLORS.white,
    },
    itemContainer: {
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 10,
        borderColor: COLORS.blue,
        borderWidth: 2,
    },
    nameText: {
        fontSize: 25,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
        color: COLORS.dark,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        left: 0,
    },
    titleText: {
        fontSize: 40,
        fontWeight: '800',
        color: COLORS.pink,
        textAlign: 'center',
        zIndex: 5,
    },
});

export default UserEvents;
