import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;

  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [photoUri, setPhotoUri] = useState(item.photoUri);
  const [location, setLocation] = useState(item.location || null);

  const takeNewPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const updateGPS = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Location access is needed.');
      return;
    }

    const position = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });
  };

  const updateItem = async () => {
    try {
      const stored = await AsyncStorage.getItem('items');
      const items = stored ? JSON.parse(stored) : [];

      const updated = items.map(i =>
        i.id === item.id
          ? { ...i, name, description, photoUri, location }
          : i
      );

      await AsyncStorage.setItem('items', JSON.stringify(updated));
      Alert.alert("Success", "Item updated!");
      navigation.goBack();
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Failed to update item.");
    }
  };

  const deleteItem = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem('items');
            const items = stored ? JSON.parse(stored) : [];

            const filtered = items.filter(i => i.id !== item.id);
            await AsyncStorage.setItem('items', JSON.stringify(filtered));
            Alert.alert("Deleted", "Item has been deleted.");
            navigation.goBack();
          } catch (error) {
            console.error("Delete failed:", error);
            Alert.alert("Error", "Failed to delete item.");
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter item name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter item description"
        multiline
      />

      <Text style={styles.label}>Photo</Text>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.image} />
          <Button title="Remove Photo" color="#888" onPress={() => setPhotoUri(null)} />
        </>
      ) : (
        <Text style={styles.placeholder}>No photo selected</Text>
      )}
      <Button title="Take New Photo" onPress={takeNewPhoto} />

      <Text style={styles.label}>GPS Location</Text>
      {location ? (
        <Text style={styles.gpsText}>
          Latitude: {location.latitude}{"\n"}
          Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.placeholder}>No location saved</Text>
      )}
      <Button title="Update GPS Location" onPress={updateGPS} />

      <View style={styles.buttonGroup}>
        <Button title="Save Changes" onPress={updateItem} />
        <View style={{ marginTop: 10 }}>
          <Button title="Delete Item" color="red" onPress={deleteItem} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  placeholder: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#888',
  },
  gpsText: {
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  buttonGroup: {
    marginTop: 20,
  },
});

export default ItemDetailScreen;
