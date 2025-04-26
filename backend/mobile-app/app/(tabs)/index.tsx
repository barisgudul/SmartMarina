import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import axios from 'axios';

export default function HomeScreen() {
  const [devices, setDevices] = useState({});
  const [environment, setEnvironment] = useState({});
  const [lastUpdated, setLastUpdated] = useState<{ [key: string]: string }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://192.168.1.103:5000/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  const fetchEnvironment = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Antalya,tr&appid=********************&units=metric`
      );
      const weatherData = response.data;
      setEnvironment({
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0].description,
        windSpeed: weatherData.wind.speed,
        city: weatherData.name,
      });
    } catch (error) {
      console.error('Failed to fetch environment:', error);
    }
  };

  const toggleDevice = async (deviceId: string) => {
    try {
      await axios.post(`http://192.168.1.103:5000/devices/${deviceId}/toggle`);
      fetchDevices();
      const now = new Date();
      setLastUpdated(prev => ({
        ...prev,
        [deviceId]: now.toLocaleTimeString(),
      }));
    } catch (error) {
      console.error('Failed to toggle device:', error);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await fetchDevices();
    await fetchEnvironment();
    const now = new Date();
    setCurrentDateTime(now.toLocaleString());
    setRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <LinearGradient colors={['#cce3f7', '#e0f7fa']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <MotiText
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: 'timing', duration: 800 }}
          style={styles.header}
        >
          🛥 Smart Marina Control
        </MotiText>

        {/* Environment Card */}
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 10, mass: 1 }}
          style={styles.environmentCard}
        >
          <Ionicons name="cloudy-outline" size={40} color="#3498db" />
          <Text style={styles.environmentText}>🗓️ {currentDateTime}</Text>
          <Text style={styles.environmentText}>🌡 Temperature: {environment.temperature} °C</Text>
          <Text style={styles.environmentText}>💧 Humidity: {environment.humidity} %</Text>
          <Text style={styles.environmentText}>📍 City: {environment.city}</Text>
          <Text style={styles.environmentText}>🌥 {environment.description}</Text>
          <Text style={styles.environmentText}>💨 {environment.windSpeed} m/s</Text>
        </MotiView>

        {/* Refresh Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={refreshAll} activeOpacity={0.7}>
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.refreshText}>{refreshing ? 'Refreshing...' : 'Refresh'}</Text>
        </TouchableOpacity>

        {/* Devices List */}
        <MotiText
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 500, duration: 500 }}
          style={styles.subheader}
        >
          Devices
        </MotiText>

        <AnimatePresence>
          {Object.entries(devices).map(([id, device]: any, index) => (
            <MotiView
              key={id}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'timing', duration: 400, delay: index * 100 }}
              style={[
                styles.deviceCard,
                { backgroundColor: device.status ? '#d0f0c0' : '#eeeeee' },
              ]}
            >
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text>Status: {device.status ? '🟢 ON' : '🔴 OFF'}</Text>
              <Switch
                value={device.status}
                onValueChange={() => toggleDevice(id)}
              />
              <Text style={styles.lastUpdated}>
                Last updated: {lastUpdated[id] || 'Not yet'}
              </Text>
            </MotiView>
          ))}
        </AnimatePresence>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  subheader: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: '#34495E',
  },
  environmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  environmentText: {
    fontSize: 18,
    marginTop: 8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 25,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  refreshText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2C3E50',
  },
  lastUpdated: {
    marginTop: 10,
    fontSize: 12,
    color: '#7F8C8D',
  },
});
