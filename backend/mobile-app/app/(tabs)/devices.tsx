import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Toast from 'react-native-root-toast';

export default function DevicesScreen() {
  const [devices, setDevices] = useState({});
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0)); // 🎬 Animasyon için

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://192.168.1.103:5000/devices');
      setDevices(response.data);
      fadeIn(); // Her veri geldiğinde yumuşak açılış
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      showToast('Failed to fetch devices', 'error');
    }
  };

  const addDevice = async () => {
    if (!deviceName || !deviceType) {
      showToast('Please fill all fields', 'error');
      return;
    }

    try {
      await axios.post('http://192.168.1.103:5000/devices', {
        name: deviceName,
        type: deviceType,
      });
      setDeviceName('');
      setDeviceType('');
      fetchDevices();
      showToast('Device successfully added!', 'success');
    } catch (error) {
      console.error('Failed to add device:', error);
      showToast('Failed to add device', 'error');
    }
  };

  const deleteDevice = async (deviceId: string) => {
    try {
      await axios.delete(`http://192.168.1.103:5000/devices/${deviceId}`);
      fetchDevices();
      showToast('Device successfully deleted!', 'success');
    } catch (error) {
      console.error('Failed to delete device:', error);
      showToast('Failed to delete device', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c',
      textColor: 'white',
      shadow: true,
      animation: true,
      hideOnPress: true,
      opacity: 0.9,
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <LinearGradient colors={['#cce3f7', '#e0f7fa']} style={{ flex: 1 }}>
      <Animated.ScrollView contentContainerStyle={styles.container} style={{ opacity: fadeAnim }}>
        <Text style={styles.header}>Manage Devices</Text>

        {/* Add New Device */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>➕ Add New Device</Text>
          <TextInput
            style={styles.input}
            placeholder="Device Name"
            value={deviceName}
            onChangeText={setDeviceName}
          />
          <TextInput
            style={styles.input}
            placeholder="Device Type (e.g., Light, AC, Camera)"
            value={deviceType}
            onChangeText={setDeviceType}
          />
          <TouchableOpacity style={styles.addButton} onPress={addDevice} activeOpacity={0.8}>
            <Text style={styles.addButtonText}>Add Device</Text>
          </TouchableOpacity>
        </View>

        {/* Device List */}
        <Text style={styles.subheader}>Device List</Text>

        <View style={styles.devicesWrapper}>
          {Object.entries(devices).map(([id, device]: any) => (
            <TouchableOpacity key={id} activeOpacity={0.8} style={styles.deviceCard}>
              <View style={styles.deviceContent}>
                <Text
                  style={styles.deviceName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {device.name}
                </Text>
                <Text
                  style={styles.deviceType}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  ({device.type || 'Unknown'})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteDevice(id)}
                style={styles.deleteButton}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
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
    marginBottom: 20,
    color: '#2C3E50',
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    color: '#34495E',
    alignSelf: 'flex-start',
  },
  inputCard: {
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495E',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  devicesWrapper: {
    width: '100%',
    gap: 15,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
  },
  deviceContent: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 15,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    maxWidth: '100%',
  },
  deviceType: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
    maxWidth: '100%',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
