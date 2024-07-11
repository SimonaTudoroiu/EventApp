import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../../../constants/colors';
import { Entypo, AntDesign, Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, set } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Button from '../../../../components/button';
import { encode as btoa } from 'base-64';
import IP from '../../../../constants/config';

const EventDetailed = ({ navigation, route }) => {
    const event_id = route.params;
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPastEvent, setIsPastEvent] = useState(false);
    const fetchEvent = async () => {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          const response = await axios.get(`http://${IP}:8080/api/event/get-event`, {
              headers: {
                  'Authorization': 'Bearer ' + accessToken
              },
              params:{
                id: event_id
              }
          });
    
          // console.log("Categories", response.data)
          const newEvent = response.data.data;
          const isPastEvent = new Date(newEvent.end_date) < new Date();

        //   console.log("Event", newEvent.start_date)
          setEvent(newEvent);
          setIsPastEvent(isPastEvent);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to get event!");
            }
            console.error('Error submitting form:', error);
    
            // setLoading(false);
            // Aici poți trata erori generale legate de obținerea token-ului sau de interogarea categoriilor
        }
      }
    const base64Convert = (image) => {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
        return base64String;
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async() => {
            setLoading(true);
            await fetchEvent();
            setLoading(false);
        });
    
        return unsubscribe;
      }, [navigation, fetchEvent]);

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
                        <View style={{ position: 'absolute',left: -150, top: 50}}>
                            
                                <AntDesign name="left" size={40} color={COLORS.blue} />
                        </View>
                    </TouchableOpacity>


                    <Image
                        key={event.name.toString()}
                        source={{ uri: 'data:image/jpeg;base64,' + base64Convert(event.image.data) }}
                        style={styles.image}
                    />{isPastEvent && (
                        <View style={styles.overlay} />
                    )}

                     <TouchableOpacity
                             onPress={() => navigation.navigate('Notification', event.event_id)}
                             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                             style={styles.notificationButton}  // Mărește zona de atingere fizic
                             >
                        <View >
                            <Ionicons name="notifications-sharp" size={40} color={COLORS.blue} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View> 
                    <Text style={styles.titleText}>{event.name}</Text>
                    <Text style={styles.subtitleText}>{event.category}</Text>
                </View>
                {isPastEvent ? (
                    <View style={{marginTop: 30}}>
                        <Text style={styles.descriptionText}>This event has already passed.</Text>
                    </View>
                ): (
                    <View>
                    <View style={{marginTop: 30}}>
                    <Text style={styles.descriptionText}>{event.description}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>Start</Text>
                        <Text style={styles.dateText}>End</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>{format(new Date(event.start_date), 'dd MMM ')}</Text>
                        <Text style={styles.date}>{format(new Date(event.end_date), 'dd MMM ')}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.hourText}>{format(new Date(event.start_date), 'HH:mm')}</Text>
                        <Text style={styles.hourText}>{format(new Date(event.end_date), 'HH:mm')}</Text>
                    </View>
                    <TouchableOpacity style={styles.locationContainer} onPress={() => navigation.navigate("EventLocation", event.Location.location_id)}>
                        <Entypo name="location" size={40} color={COLORS.pink} style={{marginHorizontal: 10}} />
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.locationText}>{event.Location.name}: {event.Location.review_summary.toFixed(1)}</Text>
                            <Entypo name="star" size={30} color="yellow" />
                        </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: "row"}}> 
                        <Text style={styles.descriptionText}>Available Spots: {event.available_spots}</Text>
                        <Text style={styles.descriptionText}>Price: {event.price}</Text>

                    </View>
                    
                    <View style={{alignItems: 'center', justifyContent: 'center',}}> 
                        <Button
                                title="Reserve Now"
                                filled= {true}
                                color={COLORS.pink}
                                onPress={() => navigation.navigate('Reservation', event.event_id)}
                                style={{
                                    width: "80%"
                                }}
                        />
                    </View>  
                    </View>
                ) }
                
            </KeyboardAwareScrollView> 
        </LinearGradient>
    )

}


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
    imageContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        width: '100%',
        height: 400,
        borderBottomLeftRadius: 200,
        borderBottomRightRadius: 200,
        overflow: 'hidden',
        position: 'relative',
        // borderRadius: 200,
    },
    notificationButton: {
        position: 'absolute',
        top: 50,
        right: 10,
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
    descriptionText:{
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.white,
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 15
    },
    dateContainer:{
        flexDirection: 'row',
        justifyContent: 'center', // Centrat pe orizontală în container
        marginHorizontal: 20,
        // marginVertical: 10,
    },
    date: {
        fontSize: 30,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
        marginHorizontal: 40
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
        marginHorizontal: 70
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
export default EventDetailed;

