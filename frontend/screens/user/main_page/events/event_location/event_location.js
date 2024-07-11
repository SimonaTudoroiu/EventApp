import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, parse, setYear, setMonth, setDate, setHours, setMinutes, set } from 'date-fns';
import COLORS from '../../../../../constants/colors';
import Button from '../../../../../components/button';
import { encode as btoa } from 'base-64';
import IP from '../../../../../constants/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { daysInYear } from 'date-fns/constants';
import MapView, { Marker } from 'react-native-maps';


const EventLocation = ({ navigation, route }) => {
    const location_id = route.params;
    const [location, setLocation] = useState({});
    const [loading, setLoading] = useState(true);
    
    const fetchLocation = async () => {
        setLoading(true);
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`http://${IP}:8080/api/location/get-location`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                id: location_id
            }
        });
        const newLocation = response.data.data;
    
        console.log("location", newLocation);   
        setLocation(newLocation);
        
        setLoading(false);
    };
    

    useEffect(() => {
        fetchLocation();
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
                <View style={styles.titleContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                        style={{  padding: 30, zIndex: 10 }}  // Mărește zona de atingere fizic
                    >
                        <View style={{ position: 'absolute',left: -150, top: 40}}>
                            
                                <AntDesign name="left" size={40} color={COLORS.pink} />
                        </View>
                    </TouchableOpacity>
                    
                    
                </View>
                <View style={{marginTop: 50}}>
                    <Text style={styles.titleText}>{location.name} </Text>
                    <Text style={styles.subtitleText}>{location.address} </Text>
                    <Text style={styles.descriptionText}>Description:</Text>
                    <Text style={styles.descriptionText}>{location.description}</Text>
                </View>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    // showsUserLocation={true}
                    // followUserLocation={true}
                >
                    
                    <Marker title={location.name} coordinate={
                        {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }
                    } />
                    

                        
                </MapView>
                <View style={styles.locationContainer}>
                    <Entypo name="location" size={40} color={COLORS.pink} style={{marginHorizontal: 10}} />
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.locationText}>{location.review_summary.toFixed(1)}</Text>
                        <Entypo name="star" size={30} color="yellow" />
                    </View>
                </View>
                
                
                {/* <Button title="Update Event" onPress={handleUpdate} /> */}
            </KeyboardAwareScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    map: {
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
        flex: 1, // Utilizează flex pentru a se ajusta la dimensiunea containerului părinte
        width: '100%',
        height: 400,
        marginTop: 20,
    },
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
        // backgroundColor: COLORS.white,
        // width: '100%',
        //  height: 400,
        // borderBottomLeftRadius: 200,
        // borderBottomRightRadius: 200,
        // overflow: 'hidden',
        // position: 'relative',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
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
        marginBottom: 20
    },
    descriptionText: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.white,
        textAlign: 'left',
        marginHorizontal: 20,
        // marginVertical: 15
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

export default EventLocation;
