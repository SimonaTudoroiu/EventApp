import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, Pressable, TouchableOpacity, FlatList} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import * as ImageManipulator from 'expo-image-manipulator'
import IP from '../../../constants/config';

const AdministratorCameraPage = ({ navigation, route }) => {
  let cameraRef = useRef();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState();

  const { email } = route.params;
  
  const compressImage = async (uri) => {
    
    try {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio 
        { compress: 0.7, format: 'jpeg' },
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
      // aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (result && !result.canceled) {
      for (let i = 0; i < result.assets.length; i++) {
        const compressedImage = await compressImage(result.assets[i].uri);
        setImages(prevImages => [...prevImages, compressedImage]);
      }
    }
    
  };

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied!');
      }
    })();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    const compressedImage = await compressImage(newPhoto.uri);
    setPhoto(compressedImage);
  };

  if (photo) {
    

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let usePhoto = () => {
      setImages(prevImages => [...prevImages, photo]);
      setPhoto(undefined); 
      console.log("images", images)
    }

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <Button title="Use Photo" onPress={usePhoto} /> 
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  if (preview) {
    const handleBack = () => {
      setPreview(undefined); // Se resetează imaginea pentru a reveni la pagina cu camera
    };
  
    const handleDelete = (index) => {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      setPreview(undefined);
    };

    

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: preview.uri }} />
        <Button title="Delete" onPress={() => handleDelete(images.indexOf(preview))} /> 
        <Button title="Back" onPress={() => handleBack()} />
      </SafeAreaView>
    );
  }

  const handleSend = async () => {

    const formData = new FormData();
    images.forEach((image, index) => {
      console.log("image", image)
      formData.append(`photos`, {
        name: `photo_${index}`,
        type: 'image/jpeg', // Schimbați tipul de fișier în funcție de nevoi
        uri: image.uri,
      });
    });

    axios.post(`http://${IP}:8080/api/admin/upload?email=${email}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
    console.log('Response from server:', response.data);
    alert("Photos uploaded successfully!")
    navigation.goBack();
    // Puteți face ceva cu răspunsul aici
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
          alert("Failed to upload photos!");
      }
      console.error('Error submitting form:', error);

    // Puteți trata eroarea aici
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef}>
          {/* Componenta pentru afișarea imaginilor */}
          <FlatList
            data={images}
            renderItem={({ item }) =>  (
              <TouchableOpacity onPress = {() => setPreview(item)}>
                <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 5 }} />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal // Afișează imaginile orizontal
            style= {{marginTop: 50}}
          />
        </CameraView>
      </View>
      {/* Butonul de captură a pozei */}
      <TouchableOpacity style={styles.buttonContainer} onPress={takePic}>
        <MaterialIcons name="photo-camera" size={50} color="white" backgroundColor='transparent' borderRadius={100}/>
      </TouchableOpacity>
      {/* Butonul de încărcare a imaginilor */}
      <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
        <AntDesign name="picture" size={50} color="white" iconStyle={{marginTop: 50}}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sendContainer} onPress={handleSend}>
        <MaterialCommunityIcons name="file-send-outline" size={50} color="white" />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  uploadContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  sendContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});


export default AdministratorCameraPage;
