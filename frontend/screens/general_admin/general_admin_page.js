import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../constants/colors';
import axios from 'axios';
import { encode as btoa } from 'base-64';
import Button from '../../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../constants/config';

const GeneralAdminPage = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      // Așteaptă obținerea tokenului de acces
      const accessToken = await AsyncStorage.getItem('accessToken');
  
      // Realizează cererea GET cu tokenul de acces
      const response = await axios.get(`http://${IP}:8080/api/general-admin/all-documents`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        timeout: 10000,
      });
  
      let data = [];
      response.data.data.forEach(item => {
        let images = [];
        item.documents.forEach(document => {
          const base64String = btoa(String.fromCharCode(...new Uint8Array(document.image.data)));
          images.push({
            image_id: document.document_id,
            base64String: base64String
          });
        });
        data.push({
          administrator: item.administrator,
          images: images
        });
      });
  
      setItems(data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
          alert("Failed to fetch data!");
      }
      console.error('Error submitting form:', error);

      setLoading(false);
    }
  }, []); // Dependențele trebuie ajustate în funcție de contextul în care este utilizată funcția
  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation, fetchData]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AdministratorDetailPage', { email: item.administrator.email, images: item.images })}>
      <View style={styles.itemContainer}>
        <View style={styles.emailContainer}>
          <Text>Email: {item.administrator.email}</Text>
        </View>
        <View style={styles.imageContainer}>
          {
            item.images.length > 0 && item.images.map(image => (
              <Image
                key={image.image_id.toString()}
                source={{ uri: 'data:image/jpeg;base64,' + image.base64String }}
                style={styles.image}
              />
            ))
          }
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavander }}>
      <FlatList
        style={{
          flex: 1,
          padding: 10,
        }}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.administrator.admin_id.toString()}
      />
      <Button 
            title="Logout" 
            filled= {true}
            onPress={async () => 
              {
                await AsyncStorage.removeItem('accessToken').catch(error => {
                  console.error('Error removing access token:', error);
                });
                navigation.goBack()}
              } 
            style={{
                marginTop: 10,
                width: "90%",
                marginHorizontal:20
            }}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    borderColor: COLORS.blue,
    borderWidth: 2,
  },
  emailContainer: {
    flex: 0,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: COLORS.pink,
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: 10,
    overflow: 'hidden'
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
});

export default GeneralAdminPage;
