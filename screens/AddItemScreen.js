import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddItemScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null);

  const saveItem = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Validation Error', 'Name and Description are required.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      description,
      photoUri,
      location,
    };

    try {
      const stored = await AsyncStorage.getItem('items');
      const items = stored ? JSON.parse(stored) : [];

      items.push(newItem);

      await AsyncStorage.setItem('items', JSON.stringify(items));

      console.log('✔ Item saved successfully');
      console.log('🧾 Saved items:', items);

      Alert.alert('Success', 'Item saved!');
      navigation.goBack();
    } catch (e) {
      console.error('❌ Save error:', e);
      Alert.alert('Error', 'Failed to save item.');
    }
  };

  // NEW: handle photo taking with expo-image-picker
  const handlePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

 
  const handleGPS = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to get GPS location.');
      return;
    }

    try {
  const { status } = await Location.requestForegroundPermissionsAsync();
  console.log("Permission status:", status);
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Location access is needed.');
    return;
  }

  const position = await Location.getCurrentPositionAsync({});
  console.log("GPS position:", position);
  setLocation({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  });
} catch (error) {
  console.error("Location error:", error);
  Alert.alert('Error', error.message);
}};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Thing Name *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="e.g. Christmas Tree Carpet"
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholder="e.g. Top shelf of walk-in closet"
      />

      <Button title="Take Photo (Optional)" onPress={handlePhoto} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}

      <Button title="Get GPS Location (Optional)" onPress={handleGPS} />
      {location && (
        <Text style={styles.gpsText}>
          GPS: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      )}

      <Button title="Save" onPress={saveItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    marginTop: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 8,
  },
  image: {
    marginVertical: 10,
    width: 200,
    height: 200,
  },
  gpsText: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AddItemScreen;
