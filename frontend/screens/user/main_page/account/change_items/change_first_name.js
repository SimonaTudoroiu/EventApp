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

const ChangeFirstName = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [first_name, setFirstName] = useState('');
    


    const handleSubmit = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.put(`http://${IP}:8080/api/users/update`,{
                first_name
            },{
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            console.log('Response from server:', response.data);
            alert('First name updated successfully!');
            navigation.navigate("Account");
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to update first name!");
            }
            console.error('Error submitting form:', error);
    
        }
    }
   
    // UseEffect pentru verificarea statutului de administrator
    // useEffect(() => {
    //     checkAdmin();
    // }, []);

    // UseEffect pentru reîncărcarea datelor când componenta primește focus
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', async () => {
    //         setLoading(true);
    //         try {
    //             const [hotEventsResponse, categoriesResponse] = await Promise.all([
    //                 fetchHotEvents(),
    //                 fetchCategories()
    //             ]);
    //             setHotEvents(hotEventsResponse);
    //             setCategories(categoriesResponse);
    //         } catch (error) {
    //             console.error('Error loading data:', error);
    //         }
    //         setLoading(false);
    //     });
    
    //     return unsubscribe;
    // }, [navigation]);
    

    // if (loading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color={COLORS.primary} />
    //         </View>
    //     );
    // }


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
                <Text style={styles.titleText}>First Name</Text>
                
            </View>
            <View style={styles.bottomContainer}>
                <KeyboardAwareScrollView style={{marginVertical: 30}}>
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8,
                            marginHorizontal: 40,
                            color: COLORS.dark
                        }}>First Name</Text>

                        <View style={{
                            width: "80%",
                            height: 48,
                            borderColor: COLORS.dark,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 22,
                            marginHorizontal: 40

                        }}>
                            <TextInput
                                placeholder='Enter your first name'
                                value={first_name}
                                onChangeText={setFirstName}
                                placeholderTextColor={COLORS.dark}
                                keyboardType='default'
                                style={{
                                    width: "100%"
                                }}
                            />
                        </View>
                    </View>
                    <Button
                        title="Submit"
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
        alignItems: 'center'
    },
    itemText: {
        fontSize: 16,
        color: COLORS.dark,
        fontWeight: '600'
    },
});

export default ChangeFirstName;
