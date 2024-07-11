import { ScrollView, View, Text, Image, Pressable, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../../../../../constants/colors';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../../../../../components/button';
import axios from 'axios';
import IP from '../../../../../../constants/config';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddEvent = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [available_spots, setAvailableSpots] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());
    const [location_id, setLocationId] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
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
            if (locations.length > 0) {
                setLocationId(locations[0].location_id);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to add event!");
            }
            console.error('Error submitting form:', error);
        }
        setLoading(false);
    };

    const handlePress = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.post(`http://${IP}:8080/api/event/save-event`, {
                location_id,
                name,
                description,
                category,
                available_spots,
                price,
                start_date,
                end_date
            },{
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            // console.log("Categories", response.data)
            const event = response.data.data;
            console.log("event", event);
            navigation.navigate("AddEventPhoto", event.event_id);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to add event!");
            }
            console.error('Error submitting form:', error);
        }
        setLoading(false);
    };
    

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || start_date;
        setShow(false);
        setStartDate(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || end_date;
        setShow(false);
        setEndDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchLocations();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavander }}>
            <KeyboardAwareScrollView>

            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity   
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                        style={[styles.iconTouch, styles.leftIcon, {padding:30}]}  // Mărește zona de atingere fizic
                    >
                        <AntDesign name="left" size={40} color={COLORS.blue} />
                    </TouchableOpacity>
                    
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: COLORS.black
                    }}>
                        New Event
                    </Text>

                    
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Name</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter the event name'
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={COLORS.black}
                            keyboardType='default'
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
                        marginVertical: 8
                    }}>Description</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter the event description'
                            value={description}
                            onChangeText={setDescription}
                            placeholderTextColor={COLORS.black}
                            keyboardType='default'
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
                        marginVertical: 8
                    }}>Category</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter the event category'
                            value={category}
                            onChangeText={setCategory}
                            placeholderTextColor={COLORS.black}
                            keyboardType='default'
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
                        marginVertical: 8
                    }}>Available Spots</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter the available spots'
                            value={parseInt(available_spots)}
                            onChangeText={setAvailableSpots}
                            placeholderTextColor={COLORS.black}
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
                        marginVertical: 8
                    }}>Price</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter the price of the event'
                            value={parseInt(price)}
                            onChangeText={setPrice}
                            placeholderTextColor={COLORS.black}
                            keyboardType='number-pad'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Start Date</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={start_date}
                            mode={"datetime"}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeStart}
                        />
                </View>

                <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>End Date</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={end_date}
                            mode={"datetime"}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeEnd}
                        />
                </View>

                {/* Picker pentru alegerea locației */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Location</Text>
                    <Picker
                        selectedValue={location_id}
                        onValueChange={(itemValue, itemIndex) => setLocationId(itemValue)}
                    >
                        {locations.map((location) => (
                            <Picker.Item key={location.location_id} label={location.name} value={location.location_id} />
                        ))}
                    </Picker>
                </View>
                <View style = {{alignItems: "center", justifyContent: "center",}}> 
                    <TouchableOpacity style = {styles.addLocationButton} onPress={handlePress}>
                        <Text style={{fontSize: 18, color: COLORS.white}}> Add Photo</Text>
                    </TouchableOpacity>
                </View>
                

                

                

                
                
            </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    addLocationButton: {
        width: "50%",
        height: 48,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 12
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        position: 'relative',
    },
    iconTouch: {
        position: 'absolute',
        padding: 10,
    },  
    leftIcon: {
        left:-20,
    },
})
export default AddEvent;