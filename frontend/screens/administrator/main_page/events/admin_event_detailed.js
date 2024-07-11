import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign, Entypo, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, parse, setYear, setMonth, setDate, setHours, setMinutes, set } from 'date-fns';
import COLORS from '../../../../constants/colors';
import Button from '../../../../components/button';
import { encode as btoa } from 'base-64';
import IP from '../../../../constants/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { daysInYear } from 'date-fns/constants';


const AdminEventDetailed = ({ navigation, route }) => {
    const event_id = route.params;
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPastEvent, setIsPastEvent] = useState(false);
    
    const fetchEvent = async () => {
        setLoading(true);
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`http://${IP}:8080/api/event/get-event`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                id: event_id
            }
        });
        const newEvent = response.data.data;

        console.log("Fetched event start date:", newEvent.start_date);
        console.log("Fetched event end date:", newEvent.end_date);
    
        if (!new Date(newEvent.start_date).getTime() || !new Date(newEvent.end_date).getTime()) {
            console.error("Invalid date received", newEvent.start_date, newEvent.end_date);
            setLoading(false);
            return;  // Exit if dates are invalid
        }
    
        setIsPastEvent(new Date(newEvent.end_date) < new Date());
        setEvent({
            ...newEvent,
            startDay: format(new Date(newEvent.start_date), 'dd'),
            startMonth: format(new Date(newEvent.start_date), 'MMM'),
            startHour: format(new Date(newEvent.start_date), 'HH'),
            startMinute: format(new Date(newEvent.start_date), 'mm'),
            endDay: format(new Date(newEvent.end_date), 'dd'),
            endMonth: format(new Date(newEvent.end_date), 'MMM'),
            endHour: format(new Date(newEvent.end_date), 'HH'),
            endMinute: format(new Date(newEvent.end_date), 'mm'),
        });
        
        setLoading(false);
    };

    const monthMapping = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

        const updateDatePart = () => {
        try {
            let parsedStartDate = new Date(event.start_date);
            let parsedEndDate = new Date(event.end_date);

            console.log("Parsed start date1:", parsedStartDate);
            console.log("Parsed end date1:", parsedEndDate);
            
            if (!isNaN(event.startDay) && monthMapping[event.startMonth] !== undefined) {
                parsedStartDate = setDate(parsedStartDate, Number(event.startDay));
                parsedStartDate = setMonth(parsedStartDate, monthMapping[event.startMonth]);
            }
            if (!isNaN(event.startHour) && !isNaN(event.startMinute)) {
                parsedStartDate = setHours(parsedStartDate, Number(event.startHour));
                parsedStartDate = setMinutes(parsedStartDate, Number(event.startMinute));
            }
            if (!isNaN(event.endDay) && monthMapping[event.endMonth] !== undefined) {
                parsedEndDate = setDate(parsedEndDate, Number(event.endDay));
                parsedEndDate = setMonth(parsedEndDate, monthMapping[event.endMonth]);
            }
            if (!isNaN(event.endHour) && !isNaN(event.endMinute)) {
                parsedEndDate = setHours(parsedEndDate, Number(event.endHour));
                parsedEndDate = setMinutes(parsedEndDate, Number(event.endMinute));
            }
            
            console.log("Parsed start date:", parsedStartDate);
            console.log("Parsed end date:", parsedEndDate);

            return { parsedStartDate, parsedEndDate };
        } catch (err) {
            console.error("Error updating date part", err);
            return { parsedStartDate: new Date(event.start_date), parsedEndDate: new Date(event.end_date) };
    }
};
    

    const handleUpdate = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        try {
            const { parsedStartDate, parsedEndDate } = updateDatePart();
            console.log("New start date:", parsedStartDate);
            console.log("New end date:", parsedEndDate);
            await axios.put(`http://${IP}:8080/api/event/update-event`, {
                event_id: event.event_id,
                name: event.name,
                start_date: parsedStartDate,
                end_date: parsedEndDate,
                description: event.description,
                available_spots: parseInt(event.available_spots),
                category: event.category,
                price: parseInt(event.price),
            }, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            alert('Event updated successfully!');
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    };

    const handleChange = (name, value) => {
        
        setEvent(prev => {
            const updatedValue = value;
            return { ...prev, [name]: updatedValue };
        });
    };

    const base64Convert = (image) => {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
        return base64String;
    }

    useEffect(() => {
        fetchEvent();
    }, [navigation, route]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <LinearGradient style={styles.linearGradient} colors={[COLORS.secondary, COLORS.primary]}>
            <KeyboardAwareScrollView>
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                        style={{  padding: 30, zIndex: 10 }}  // Mărește zona de atingere fizic
                    >
                        <View style={{ position: 'absolute',left: -150, top: 40}}>
                            
                                <AntDesign name="left" size={40} color={COLORS.blue} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AdminReservations', event.event_id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                        style={styles.inboxButton}  // Mărește zona de atingere fizic
                    >
                        <View>
                            
                            <FontAwesome5 name="inbox" size={35} color={COLORS.blue} />
                        </View>
                    </TouchableOpacity>
                    
                    <Image source={{ uri: 'data:image/jpeg;base64,' + base64Convert(event.image.data) }} style={styles.image} />
                    {isPastEvent && <View style={styles.overlay} />}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DeleteEvent', event.event_id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                        style={styles.deleteButton}  // Mărește zona de atingere fizic
                    >
                        <View >
                            <MaterialIcons name="delete" size={40} color={COLORS.blue} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notification', event.event_id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                        style={styles.notificationButton}  // Mărește zona de atingere fizic
                    >
                        <View >
                            <Ionicons name="notifications-sharp" size={40} color={COLORS.blue} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddNotification', event.event_id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                        style={styles.addNotificationButton}  // Mărește zona de atingere fizic
                    >
                        <View >
                            <MaterialIcons name="notification-add" size={42} color={COLORS.blue} />
                        </View>
                    </TouchableOpacity>
                    
                </View>
                <View>
                    <TextInput style={styles.titleText} value={event.name} onChangeText={(text) => handleChange('name', text)} multiline/>
                    <TextInput style={styles.subtitleText} value={event.category} onChangeText={(text) => handleChange('category', text)} multiline/>
                    <TextInput style={styles.descriptionText} value={event.description} onChangeText={(text) => handleChange('description', text)} multiline />
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Start</Text>
                    <Text style={styles.dateText}>End</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={{flexDirection:"row", marginHorizontal:40}}>
                        <TextInput  style={styles.date} value={event.startDay} onChangeText={(text) => handleChange('startDay', text)} />
                        <TextInput  style={styles.date} value={event.startMonth} onChangeText={(text) => handleChange('startMonth', text)} />
                    </View>
                    <View style={{flexDirection:"row", marginHorizontal:40}}>
                        <TextInput  style={styles.date} value={event.endDay} onChangeText={(text) => handleChange('endDay', text)} />
                        <TextInput  style={styles.date} value={event.endMonth} onChangeText={(text) => handleChange('endMonth', text)} />
                    </View>
                </View>
                <View style={styles.dateContainer}>
                    <View style={{flexDirection:"row", marginHorizontal:70}}>
                        <TextInput  style={styles.hourText} value={event.startHour} onChangeText={(text) => handleChange('startHour', text)} />
                        <Text style={styles.hourText}>:</Text>
                        <TextInput  style={styles.hourText} value={event.startMinute} onChangeText={(text) => handleChange('startMinute', text)} />
                    </View>
                    <View style={{flexDirection:"row", marginHorizontal:70}}>
                        <TextInput  style={styles.hourText} value={event.endHour} onChangeText={(text) => handleChange('endHour', text)} />
                        <Text style={styles.hourText}>:</Text>
                        <TextInput  style={styles.hourText} value={event.endMinute} onChangeText={(text) => handleChange('endMinute', text)} />
                    </View>
                </View>
                <TouchableOpacity style={styles.locationContainer} onPress={() => navigation.navigate("LocationDetailed", event.Location.location_id)}>
                    <Entypo name="location" size={40} color={COLORS.pink} style={{marginHorizontal: 10}} />
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.locationText}>{event.Location.name}: {event.Location.review_summary.toFixed(1)}</Text>
                        <Entypo name="star" size={30} color="yellow" />
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection: "row"}}> 
                    <View style={{flexDirection: "row", marginHorizontal: 30}}>
                        <Text style={styles.lastText}>Available Spots: </Text>
                        <TextInput style={styles.lastText} value={event.available_spots.toString()} onChangeText={(text) => handleChange('available_spots', text)} />
                    </View>
                    <View style={{flexDirection: "row", marginHorizontal: 30}}>
                        <Text style={styles.lastText}>Price: </Text>
                        <TextInput style={styles.lastText} value={event.price.toString()} onChangeText={(text) => handleChange('price', text)} />
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center',}}> 
                    <Button
                        title="Update Event"
                        filled= {true}
                        color={COLORS.pink}
                        onPress={handleUpdate}
                        style={{
                            width: "80%"
                        }}
                    />
                </View> 
                {/* <Button title="Update Event" onPress={handleUpdate} /> */}
            </KeyboardAwareScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        marginTop: 0,
        zIndex: 5
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        width: '100%',
        height: 400,
        borderBottomLeftRadius: 200,
        borderBottomRightRadius: 200,
        overflow: 'hidden',
        position: 'relative',
    },
    notificationButton: {
        position: 'absolute',
        top: 50,
        right: 10,
        padding: 10,
        zIndex: 10,
    },
    addNotificationButton: {
        position: 'absolute',
        top: 100,
        right: 10,
        padding: 10,
        zIndex: 10,
    },
    inboxButton: {
        position: 'absolute',
        top: 100,
        left: 20,
        padding: 10,
        zIndex: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 50,
        // right: 10,
        alignItems: 'center',
        padding: 10,
        zIndex: 10,
    },
    titleText: {
        fontSize: 50,
        fontWeight: '800',
        color: COLORS.pink,
        textAlign: 'center',
        zIndex: 5,
    },
    subtitleText: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.pink,
        textAlign: 'center',
        zIndex: 5,
    },
    descriptionText: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.white,
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 15
    },
    lastText:{
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.white,
        textAlign: 'left',
        marginHorizontal: 0,
        marginVertical: 15
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Centrat pe orizontală în container
        marginHorizontal: 20,
    },
    date: {
        fontSize: 30,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
        marginHorizontal: 5
    },
    dateText: {
        fontSize: 30,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
        marginHorizontal: 65
    },
    hourText: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
        marginHorizontal: 0
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    locationText: {
        fontSize: 30,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Face overlay-ul să acopere complet imaginea
        backgroundColor: 'rgba(128, 128, 128, 0.5)', // Fundal gri semi-transparent
        zIndex: 7
    },
});

export default AdminEventDetailed;
