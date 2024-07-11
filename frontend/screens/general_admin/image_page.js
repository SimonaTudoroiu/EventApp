import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../constants/colors';
import Button from '../../components/button'
import { Colors } from 'react-native/Libraries/NewAppScreen';
const ImagePage = ({ navigation, route }) => {
  const { image } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lavander }}>
    <View style={styles.container}>
        <Image
            key={image.image_id.toString()}
            source={{ uri: 'data:image/jpeg;base64,' + image.base64String}}
            style={styles.image}
            resizeMode="contain"
        />
        <Button 
            title="Back" 
            filled= {true}
            color= {COLORS.blue}
            onPress={() => navigation.goBack()} 
            style={{
                marginTop: 200,
                width: "100%"
            }}
        />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    flex: 1, // face ca imaginea să ocupe tot spațiul disponibil în containerul său
    alignSelf: 'stretch', // face ca imaginea să se întindă pe întreaga lățime a containerului
    margin: 10, // adăugați margini dacă este necesar
    borderRadius: 10,
  }
});

export default ImagePage;
