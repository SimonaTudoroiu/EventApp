import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../../../../../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import { Rating } from "react-native-rating-element";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../../../../../constants/config';

const EventReview = ({ route, navigation }) => {
    const eventId = route.params;
    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');

    const submitReview = async () => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            console.log('Event ID:', eventId)
            if(comment){
                const response = await axios.post(`http://${IP}:8080/api/review/save-review`,{
                    event_id: eventId,
                    rating,
                    comment
                },{
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                });
                console.log('Response from server:', response.data);
            }
            else{
                const response = await axios.post(`http://${IP}:8080/api/review/save-review`,{
                    event_id: eventId,
                    rating
                },{
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                });
                console.log('Response from server:', response.data);
            }
            alert('Review submitted successfully!');
            navigation.goBack();
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to submit review!");
            }
            console.error('Error submitting form:', error);
    
        }
        // Aici poți adăuga logica pentru a trimite review-ul către server
        // console.log('Review Submitted', { eventId, rating, comment });
        // navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.pink }}>
            
            <View style={styles.titleContainer}>
                <TouchableOpacity
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={[styles.iconTouch, styles.leftIcon, { padding: 30 }]}
                >
                <AntDesign name="left" size={40} color={COLORS.dark} />
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView>
            <View style={styles.container}>
                
                <Text style={styles.titleText}>Review Event</Text>
                {/* <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={rating}
                    selectedStar={(rating) => setRating(rating)}
                    fullStarColor={'gold'}
                    // starSize={30}
                    containerStyle={{ paddingVertical: 10 }}
                /> */}
                <Rating
                    rated={rating}
                    totalCount={5}
                    ratingColor= {COLORS.blue}
                    ratingBackgroundColor="#d4d4d4"
                    size={50}
                    readonly={false}
                    icon="star"
                    direction="row"
                    onIconTap={(position) => {
                        console.log("New Rating:", position);
                        setRating(position);
                    }}
                    
                />

                <TextInput
                    style={styles.input}
                    onChangeText={setComment}
                    value={comment}
                    placeholder="Write a comment..."
                    multiline
                />
                <TouchableOpacity style={styles.button} onPress={submitReview}>
                    <Text style={styles.buttonText}>Submit Review</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 100,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderColor: 'gray',
        borderRadius: 5,
    },
    button: {
        backgroundColor: COLORS.blue,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        position: 'relative',
    },
    iconTouch: {
        position: 'absolute',
        padding: 10,
    },
    leftIcon: {
        left: -10,
    },
    titleText: {
        fontSize: 50,
        fontWeight: '800',
        color: COLORS.dark,
        textAlign: 'center',
        zIndex: 5,
    },
});

export default EventReview;
