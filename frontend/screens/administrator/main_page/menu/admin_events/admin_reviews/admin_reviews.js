import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../../../../../constants/colors';
import { Entypo, AntDesign, Ionicons} from '@expo/vector-icons';
import IP from '../../../../../../constants/config';

const AdminReviews = ({navigation, route}) => {
    const event_id = route.params;  
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);  // Paginile încep de la 0 acum
    const [totalPages, setTotalPages] = useState(0);

    // Functie pentru a incarca notificari
    const fetchReviews = async (pageNum) => {
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`http://${IP}:8080/api/review/get-all-review`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                params: {
                    page: pageNum,
                    size: 5,
                    event_id
                }
            });
            console.log('Response from server:', response.data);
            setReviews(response.data.data);
            setTotalPages(response.data.totalPages);  // Presupunem că serverul returnează numărul total de pagini
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(page);
    }, [page]);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.nameText}>{item.User.first_name} {item.User.last_name}: </Text>
                <Text style={styles.itemText}>{item.rating}</Text>
                <Entypo name="star" size={16} color="yellow" />
            </View>
            <Text style={styles.itemText}>{item.comment}</Text>
            <Text style={styles.itemDate}>{new Date(item.review_date).toLocaleDateString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View>
                    <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
                            style={{  padding: 30  }}  // Mărește zona de atingere fizic
                        >
                        <View style={{ position: 'absolute', marginTop:30}}>
                            
                                <AntDesign name="left" size={40} color={COLORS.pink} />
                        </View>
                    </TouchableOpacity>
                    <FlatList
                        data={reviews}
                        renderItem={renderItem}
                        keyExtractor={item => item.review_id.toString()}
                        style={{marginTop: 20}}
                    />
                </View>
            )}
            <View style={styles.paginationContainer}>
                <TouchableOpacity onPress={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
                    <Text style={[styles.pageButton, page === 0 && styles.disabledButton]}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.pageNumber}>Page {page + 1} of {totalPages}</Text>
                <TouchableOpacity onPress={() => setPage(prev => (prev < totalPages - 1 ? prev + 1 : prev))} disabled={page === totalPages - 1}>
                    <Text style={[styles.pageButton, page === totalPages - 1 && styles.disabledButton]}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.primary,
        paddingBottom: 50, // Asigură spațiu la fund pentru paginationContainer
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey,
        // marginVertical: 50
    },
    nameText:{
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.dark,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.dark,
    },
    itemDate: {
        fontSize: 12,
        color: '#666',
    },
    paginationContainer: {
        position: 'absolute',  // Fixează containerul de paginare la fundul view-ului părinte
        left: 20,
        right: 20,
        bottom: 30,            // Distanță de fundul ecranului
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pageButton: {
        fontSize: 16,
        color: 'blue',
    },
    pageNumber: {
        fontSize: 16,
        color: COLORS.dark,
    },
    disabledButton: {
        color: 'grey',
    }
});

export default AdminReviews;
