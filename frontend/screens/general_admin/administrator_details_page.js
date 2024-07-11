import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../constants/colors';
import Button from '../../components/button';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../constants/config';

const AdministratorDetailPage = ({ navigation, route }) => {
  const { email, images } = route.params;
  const [loading, setLoading] = useState(true);

  const handleAccept = async () => {
    try{
      const accessToken = await AsyncStorage.getItem('accessToken');

      const response = await axios.post(`http://${IP}:8080/api/general-admin/accept-administrator`, {
        email
      }, 
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      },
      {
        timeout: 10000,
      })
      console.log('Response from server:', response.data);
      alert('Administrator accepted successfully!');
      navigation.goBack();
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
          alert("Failed to accept administrator!");
      }
      console.error('Error submitting form:', error);

      setLoading(false);
    }
  };
  const handleDeny = async () => {
    try{
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.delete(`http://${IP}:8080/api/general-admin/deny-administrator?email=${email}`, 
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      },
      {
          timeout: 10000,
      });
      console.log('Response from server:', response.data);
      alert('Administrator denied successfully!');
      navigation.goBack();
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
          alert("Failed to deny administrator!");
      }
      console.error('Error submitting form:', error);

      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavander }}>
    <KeyboardAwareScrollView>
    <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={{ fontSize: 30}}> {email}</Text>
        </View>
        <Text style={{ fontSize: 20}}>Provided documents:</Text>
        <View style={styles.imageContainer}>
            {images.map((image) => (
                <TouchableOpacity key = {image.image_id.toString()} onPress={() => navigation.navigate('ImagePage', { image: image })}>
                    <Image
                        kery={image.image_id.toString()}
                        source={{ uri: 'data:image/jpeg;base64,' + image.base64String}}
                        style={styles.image}
                    />
                </TouchableOpacity>
            ))}
        </View>
        <View style = {styles.buttonsContainer}>
            <Button 
                title="Accept"
                filled={true}
                style={{ width: "45%", marginHorizontal:10}}
                onPress={handleAccept}
            />
            <Button
                title="Deny"
                filled={true}
                style={{ width: "45%", marginHorizontal:10 }}
                onPress={handleDeny}
            />
        </View>
        <Button 
            title="Back" 
            filled= {true}
            onPress={() => navigation.goBack()} 
            style={{
                marginTop: 10,
                width: "90%",
                marginHorizontal:20
            }}
        />
    </View>
    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  imageContainer: {
    // flexDirection: 'row',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  titleContainer:{
    marginTop: 50,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: COLORS.pink,
    borderRadius: 10,
    padding: 5,
  },
  buttonsContainer : {
    flexDirection: 'row',
    marginTop: 50,
  }
});

export default AdministratorDetailPage;
