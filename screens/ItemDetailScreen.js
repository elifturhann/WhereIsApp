import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
      const stored = await SecureStore.getItemAsync('items');
      const items = stored ? JSON.parse(stored) : [];

      const updated = items.map(i =>
        i.id === item.id
          ? { ...i, name, description, photoUri, location }
          : i
      );

      await SecureStore.setItemAsync('items', JSON.stringify(updated));
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
            const stored = await SecureStore.getItemAsync('items');
            const items = stored ? JSON.parse(stored) : [];

            const filtered = items.filter(i => i.id !== item.id);
            await SecureStore.setItemAsync('items', JSON.stringify(filtered));
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter item name"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter item description"
        multiline
      />

      <Text style={styles.label}>Photo:</Text>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.image} />
          <Button title="Remove Photo" color="#888" onPress={() => setPhotoUri(null)} />
        </>
      ) : (
        <Text style={styles.placeholder}>No photo selected</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={takeNewPhoto}>
        <Text style={styles.buttonText}>Take New Photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>GPS Location:</Text>
      {location ? (
        <Text style={styles.gpsText}>
          Latitude: {location.latitude}{"\n"}
          Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.placeholder}>No location saved</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={updateGPS}>
        <Text style={styles.buttonText}>Update Location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={updateItem}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#D9534F' }]} onPress={deleteItem}>
        <Text style={styles.buttonText}>Delete Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFDF6',
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#6F7863',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    fontFamily: 'Delius',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 2,
    fontFamily: 'Delius',
  },
  textArea: {
    height: 40,
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
  button: {
    backgroundColor: '#A3B8B1',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFDF6',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Delius',
  },
});

export default ItemDetailScreen;
