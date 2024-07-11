import { View, Text, Pressable, Image } from 'react-native'
import {React, useEffect} from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Welcome = ({ navigation }) => {

    useEffect(() => {
        // Declare the async function inside the useEffect
        async function clearStorage() {
            try {
                const keys = await AsyncStorage.getAllKeys();
                if (keys.length > 0) {
                    console.log("Keys in AsyncStorage:", keys);
                    await AsyncStorage.clear();
                } else {
                    console.log("AsyncStorage is already empty.");
                }
            } catch (error) {
                console.error("Failed to clear AsyncStorage:", error);
            }
        }

        // Call the function immediately
        clearStorage();
    }, []);

    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.secondary, COLORS.primary]}
        >
            <View style={{ flex: 1 }}>
                

                {/* content  */}

                <View style={{
                    paddingHorizontal: 22,
                    position: "absolute",
                    top: 300,
                    width: "100%"
                }}>
                    <Text style={{
                        fontSize: 50,
                        fontWeight: 800,
                        color: COLORS.pink,
                        textAlign: 'center'
                    }}>EventApp</Text>
                    

                    <View style={{ marginVertical: 50 }}>
                        <Text style={{
                            fontSize: 20,
                            color: COLORS.white,
                            marginVertical: 4,
                            textAlign: 'center'
                        }}>All events in one place</Text>
                        <Text style={{
                            fontSize: 20,
                            color: COLORS.white,
                            textAlign: 'center'
                        }}>Seamlessly managing every detail</Text>
                    </View>

                    <View style={{ marginTop: 50 }}>
                        <Text style={{
                            fontSize: 20,
                            color: COLORS.white,
                            marginVertical: 4,
                            textAlign: 'center'
                        }}>What do you want to do on this app?</Text>
                        
                    </View>

                    <Button
                        title="Find Events"
                        onPress={() => navigation.navigate("Login")}
                        style={{
                            marginTop: 50,
                            width: "100%"
                        }}
                    />

                    <Button
                        title="Post Events"
                        onPress={() => navigation.navigate("LoginAdmin")}
                        style={{
                            marginTop: 10,
                            width: "100%"
                        }}
                    />

                    
                </View>
            </View>
        </LinearGradient>
    )
}

export default Welcome