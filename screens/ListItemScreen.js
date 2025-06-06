import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ListItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const stored = await SecureStore.getItemAsync('items');
        const data = stored ? JSON.parse(stored) : [];
        setItems(data);
        setFilteredItems(data);
      } catch (e) {
        console.error("🔐 Failed to load encrypted items:", e);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadItems);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const text = searchText.trim().toLowerCase();
    if (text === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(text)
      );
      setFilteredItems(filtered);
    }
  }, [searchText, items]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      {item.photoUri && (
        <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
      )}
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder=" 🔍 Search items by name"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFDF6',
    flex: 1,
  },
  searchBar: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Delius',
  },
  itemContainer: {
    backgroundColor: '#EEE5DA',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Delius',
  },
});

export default ListItemsScreen;
