import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import COLORS from '../../../../../../constants/colors';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import IP from "../../../../../../constants/config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectLocation = ({navigation, route}) => {
  const { name, address, description } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapReady, setMapReady] = useState(false);  // State to handle map readiness

  const handleSubmit = async () => {
    console.log(name, address, description, selectedLocation.latitude, selectedLocation.longitude)
    const accessToken = await AsyncStorage.getItem('accessToken');
    axios.post(`http://${IP}:8080/api/location/save-location`, {
        name,
        address,
        description,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude
    }, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    },
    {
        timeout: 10000,
    })
    .then(response => {
    console.log('Response from server:', response.data);
    alert("Location added successfully!");
    navigation.navigate("AdminLocations");
    // Puteți face ceva cu răspunsul aici
    })
    .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message);
        } else {
            alert("Failed to add location!");
        }
        console.error('Error submitting form:', error);

    // Puteți trata eroarea aici
    });

}; 
  const handlePress = (event) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 5000
      });
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
  


      setMapReady(true);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && mapReady ? (
        <>
          <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[styles.iconTouch, styles.leftIcon, { padding: 30 }]}
            >
              <AntDesign name="left" size={40} color={COLORS.pink} />
            </TouchableOpacity>
            <Text style={styles.titleText}>Select Location</Text>
          </View>
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            followUserLocation={true}
            showsMyLocationButton	={true}
            onPress={handlePress}
          >
            {selectedLocation && (
                <Marker title="Selected Location" coordinate={selectedLocation} />
            )}

                
          </MapView>
          <View style = {{alignItems: "center", justifyContent: 'flex-end'}}> 
                <TouchableOpacity style = {styles.addLocationButton} onPress={handleSubmit}>
                        <Text style={{fontSize: 18, color: COLORS.white}}> Add Location</Text>
                </TouchableOpacity>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color={COLORS.pink} style={styles.spinner} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  map: {
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    flex: 1, // Utilizează flex pentru a se ajusta la dimensiunea containerului părinte
    width: '100%'
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
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.pink,
    textAlign: 'center',
    zIndex: 5,
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  addLocationButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
});

export default SelectLocation;
