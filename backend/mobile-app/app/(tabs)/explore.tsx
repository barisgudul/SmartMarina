import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import * as Notifications from 'expo-notifications'; // 📢 Bildirim için

export default function ExploreScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [stormAlert, setStormAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Antalya,tr&appid=*****************&units=metric`
      );
      setWeather(response.data);

      if (response.data.wind.speed > 12) {
        setStormAlert(true);
        sendStormNotification(); // 🌪️ Fırtına varsa bildir
      } else {
        setStormAlert(false);
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  const sendStormNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Storm Alert at Setur Marina!',
        body: 'Strong winds detected. Please take precautions.',
        sound: 'default',
      },
      trigger: null,
    });
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('tr-TR'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#cce3f7', '#e0f7fa']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <MotiText
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.header}
        >
          Explore - Setur Marina
        </MotiText>

        {/* Time */}
        <MotiText
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 400, duration: 500 }}
          style={styles.subheader}
        >
          🗓️ {currentTime}
        </MotiText>

        {/* Weather Card */}
        {weather && (
          <>
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>🌡 Weather Overview</Text>
              <View style={styles.infoRow}>
                <Text>Temperature:</Text>
                <Text style={styles.value}>{weather.main.temp} °C</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Humidity:</Text>
                <Text style={styles.value}>{weather.main.humidity} %</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Wind Speed:</Text>
                <Text style={styles.value}>{weather.wind.speed} m/s</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Pressure:</Text>
                <Text style={styles.value}>{weather.main.pressure} hPa</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Sunrise:</Text>
                <Text style={styles.value}>
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('tr-TR')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Sunset:</Text>
                <Text style={styles.value}>
                  {new Date(weather.sys.sunset * 1000).toLocaleTimeString('tr-TR')}
                </Text>
              </View>
            </MotiView>

            {/* Storm Alert */}
            <AnimatePresence>
              {stormAlert && (
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', damping: 8 }}
                  style={[styles.card, { backgroundColor: '#ffe6e6' }]}
                >
                  <Text style={styles.cardTitle}>⚠️ Storm Alert!</Text>
                  <Text>Strong winds detected. Take precautions!</Text>
                </MotiView>
              )}
            </AnimatePresence>

            {/* Marina Status */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 400, type: 'timing', duration: 600 }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>🛥 Marina Status</Text>
              <View style={styles.infoRow}>
                <Text>Dock Occupancy:</Text>
                <Text style={styles.value}>65%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Electricity Usage:</Text>
                <Text style={styles.value}>72.5 kWh</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Wave Height:</Text>
                <Text style={styles.value}>0.8 meters</Text>
              </View>
            </MotiView>

            {/* Map */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 600, duration: 800 }}
              style={styles.mapCard}
            >
              <Text style={styles.cardTitle}>📍 Setur Marina Location</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 36.8550,
                  longitude: 30.7400,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={{ latitude: 36.8550, longitude: 30.7400 }} title="Setur Marina" />
              </MapView>
            </MotiView>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2C3E50',
  },
  subheader: {
    fontSize: 16,
    marginBottom: 20,
    color: '#7f8c8d',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495E',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  value: {
    fontWeight: '600',
  },
  mapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    height: 300,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  map: {
    flex: 1,
  },
});
