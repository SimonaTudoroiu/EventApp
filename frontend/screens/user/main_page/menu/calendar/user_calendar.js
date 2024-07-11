import React, {useState, useEffect} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Entypo, AntDesign } from '@expo/vector-icons';
import COLORS from '../../../../../constants/colors';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP from '../../../../../constants/config';
import { addDays, isBefore, format } from 'date-fns';

const UserCalendar = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`http://${IP}:8080/api/user-calendar/get-events`, {
          headers: {
              'Authorization': 'Bearer ' + accessToken
          }
      });

      // console.log("Categories", response.data)
      const events = response.data.data;

      const newEvents = {};
      for (const event of events) {
        // console.log("Event", event.name)
        const startDate = new Date(event.start_date); // Exemplu de dată de start
        const endDate = new Date(event.end_date);  // Exemplu de dată de sfârșit
        const startTime = format(startDate, 'HH:mm');
        const endTime = format(endDate, 'HH:mm');

        // console.log("Start date", startDate)
        // console.log("End date", endDate)

        let currentDate = startDate;

        // console.log(format(currentDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd'))
        while (isBefore(currentDate, endDate) || format(currentDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
            if (!newEvents[format(currentDate, 'yyyy-MM-dd')]) {
                newEvents[format(currentDate, 'yyyy-MM-dd')] = [];
            }
            const newEvent = {
              event_id: event.event_id,
              name: event.name,
              start_time: startTime, 
              end_time: endTime,
              location_name: event.Location.name,
              location_address: event.Location.address,
            }
            newEvents[format(currentDate, 'yyyy-MM-dd')].push(newEvent);

            // console.log(format(currentDate, 'yyyy-MM-dd'));
            currentDate = addDays(currentDate, 1);
        }
      }
      // console.log("Events", newEvents);

      setEvents(newEvents);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
          alert("Failed to get events!");
      }
      console.error('Error submitting form:', error);

        // setLoading(false);
        // Aici poți trata erori generale legate de obținerea token-ului sau de interogarea categoriilor
    }
  }
  const renderEmptyData = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondary}}>
        <Text style={{fontSize: 30, color: COLORS.dark, fontWeight: '600'}}>No events for this day</Text>
      </View>
    );
  };



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      await fetchEvents();
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation, fetchEvents]);

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
}
  return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TouchableOpacity   
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Mărește zona de atingere
              style={[styles.iconTouch, styles.leftIcon, {padding:30}]}  // Mărește zona de atingere fizic
          >
                <AntDesign name="left" size={40} color={COLORS.pink} />
          </TouchableOpacity>
          <Text style={styles.titleText}>Calendar</Text>
                  
        </View>
        <Agenda
          items={events}
          showOnlySelectedDayItems={true}
          renderEmptyData={renderEmptyData} 
          renderItem={(item, isFirst) => (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('EventDetailed', item.event_id)}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.start_time}-{item.end_time}</Text>
              <View style={styles.locationContainer}>
                <Entypo name="location" size={20} color={COLORS.dark} style={{marginRight: 10}} />
                <Text style={styles.itemText}>{item.location_name}: {item.location_address}</Text>
              </View>
            </TouchableOpacity>
          )}
          theme={{calendarBackground: COLORS.white, agendaKnobColor: COLORS.pink, textDayHeaderFontSize: 16}}
          
        />
      </View>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
  },
  item: {
    backgroundColor: COLORS.lavander,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom:20
  },
  itemText: {
    color: 'black',
    fontSize: 16,
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
      left:0,
  },
  titleText: {
      fontSize: 50,
      fontWeight: '800',
      color: COLORS.pink,
      textAlign: 'center',
      zIndex: 5,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green'
  },
  dayItem: {
    marginLeft: 34
  },
  locationContainer: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
}
});

export default UserCalendar;

