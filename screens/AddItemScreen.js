import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native';
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
      console.log('Saved items:', items);

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
    <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
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
       
            {!photoUri && (
        <TouchableOpacity
            style={styles.button}
            onPress={handlePhoto}>
            <Text style={styles.buttonText}>Take Photo </Text>
        </TouchableOpacity>
        )}

        {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.image} />
        )}

            {!location && (
        <TouchableOpacity
            style={styles.button}
            onPress={handleGPS}>
            <Text style={styles.buttonText}>Get GPS Location</Text>
        </TouchableOpacity>
        )}

        {location && (
        <Text style={styles.gpsText}>
            GPS: {"\n"}
            Latitude: {location.latitude.toFixed(6)},
            Longitude:{location.longitude.toFixed(6)}
        </Text>
        )}


        <View style={styles.saveButtonWrapper}>
    <TouchableOpacity style={styles.button} onPress={saveItem}>
        <Text style={styles.buttonText}> Save</Text>
    </TouchableOpacity>
    </View>
        
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 35,
     backgroundColor: '#FFFDF6',
    flex: 1,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    color: '#6F7863',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 10,
    padding: 8,
    
  },
  button: {
  backgroundColor: '#A3B8B1', 
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: 10,
  marginVertical: 30,
  width: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
},
buttonText: {
  color: '#FFFDF6',
  fontSize: 16,
  fontWeight: 'bold',
},
saveButtonWrapper: {
  marginTop: 'auto', 
  paddingTop: 30,   
  paddingBottom: 100, 
},

gpsText:{
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#6F7863',
    textAlign: 'center',
},
  image: {
    marginVertical: 40,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blob1: {
    width: 200,
    height: 200,
    backgroundColor: '#DDE0CC',
    top: -30,
    left: -50,
    transform: [{ rotate: '20deg' }],
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: '#A6ACA7',
    top: 40,
    right: -120,
    transform: [{ rotate: '45deg' }],
  },
  blob3: {
     width: 160,
    height: 160,
    backgroundColor: '#A3B8B1',
    bottom: 50,
    right: -40,
    transform: [{ rotate: '-20deg' }],
  },

});

export default AddItemScreen;
