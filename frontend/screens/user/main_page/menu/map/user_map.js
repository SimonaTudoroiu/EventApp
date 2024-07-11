import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import COLORS from '../../../../../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserMap = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const [routeLines, setRouteLines] = useState([]);

  const getDirections = async (startLoc, destLoc) => {
    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          coordinates: [[startLoc.longitude, startLoc.latitude], [destLoc.longitude, destLoc.latitude]]
        },
        {
          headers: {
            'Authorization': '5b3ce3597851110001cf6248e2ef7bd49e9d430b8272c28cb55c1af2',
            'Content-Type': 'application/json'
          }
        }
      );
      const { routes } = response.data;
      const routeCoordinates = decodePolyline(routes[0].geometry);
      setRouteLines(routeCoordinates);
    } catch (error) {
      console.error('Failed to fetch directions:', error);
    }
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return points;
  };

  const refineEvents = async (events) => { 
    const refinedEvents = [];
    for (const event of events) {
        const eventObject = {
            latitude: event.Location.latitude,
            longitude: event.Location.longitude,
            title: event.name,
            id : event.event_id
        }
        // console.log(eventObject);
        refinedEvents.push(eventObject);
    }
    return refinedEvents;
};

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const events = await AsyncStorage.getItem('events');
      setMarkers(await refineEvents(JSON.parse(events)));
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
            <Text style={styles.titleText}>Events Map</Text>
          </View>
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            followUserLocation={true}
            showsMyLocationButton={true}
          >
            {markers.map(marker => (
              <Marker
                key={marker.id.toString()}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title}
                onPress={() => {
                  getDirections(location, { latitude: marker.latitude, longitude: marker.longitude });
                }}
                onCalloutPress={() => navigation.navigate('EventDetailed', marker.id)}
              />
            ))}
            {routeLines.length > 0 && (
              <Polyline
                coordinates={routeLines}
                strokeWidth={5}
                strokeColor="red"
              />
            )}
          </MapView>
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
    flex: 1,
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
    fontSize: 40,
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
});

export default UserMap;
