import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../../../../../constants/config';
import * as ImageManipulator from 'expo-image-manipulator'
import COLORS from '../../../../../../constants/colors';
import { LinearGradient } from "expo-linear-gradient";

const AddEventPhoto = ({ navigation, route }) => {
  const [photo, setPhoto] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);

  const event_id  = route.params;

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const compressImage = async (uri) => {
    
    try {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio 
        { compress: 0.6, format: 'jpeg' },
       );
       console.log("resizedPhoto", resizedPhoto)
      return resizedPhoto;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (result && !result.canceled) {
    //   const compressedImage = await compressImage(result.assets[0].uri);

    //   setPhoto(compressedImage);
        console.log(result)
        setPhoto(result.assets[0]);
    }
  };

  const handleSend = async () => {
    if (!photo) {
      alert("No photo selected");
      return;
    }

    const formData = new FormData();
    formData.append("photo", {
      name: `photo_${event_id}`,
      type: 'image/jpeg',
      uri: photo.uri,
    });

    const accessToken = await AsyncStorage.getItem('accessToken');

    axios.put(`http://${IP}:8080/api/event/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + accessToken
      },
      params: {
        id: event_id
      }
    })
    .then(response => {
      console.log('Response from server:', response.data);
      alert("Event added successfully!");
      navigation.navigate("AdminAllEvents");
    })
    .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message);
        } else {
            alert("Failed to add location!");
        }
        console.error('Error submitting form:', error);
    });
  };

  return (
    <LinearGradient style={{flex: 1}} colors={[COLORS.secondary, COLORS.primary]}>

    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={{fontSize: 18, color: COLORS.white}}>Pick an image from camera roll</Text>
        </TouchableOpacity>
        {photo && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photo.uri }} style={styles.preview} />
            <TouchableOpacity style={styles.button} onPress={handleSend}>
              <Text style={{fontSize: 18, color: COLORS.white}}>Use this photo</Text>
            </TouchableOpacity>
          </View>
        )}
      <StatusBar style="auto" />
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: 300,
    height: 300,
  },
  button: {
    width: "70%",
    height: 48,
    backgroundColor: COLORS.pink,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12
  }
});

export default AddEventPhoto;
