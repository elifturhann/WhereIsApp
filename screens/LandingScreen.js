import React from 'react';
import { View, Button, StyleSheet, Text, Dimensions,  TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background Blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />
      <View style={[styles.blob, styles.blob4]} />
      <View style={[styles.blob, styles.blob5]} />

      {/* Foreground Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Where Is App</Text>
        
        <View style={styles.spacing} />

        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddItem')}>
        <Text style={styles.buttonText}>Add Items</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ListItems')}>
        <Text style={styles.buttonText}>List Items</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#A6ACA7',
    fontWeight: '600',
    letterSpacing: 2,
  },
  button: {
  backgroundColor: '#A3B8B1', 
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginVertical: 10,
  alignItems: 'center',
},
buttonText: {
  color: '#FFFDF6',
  fontSize: 16,
  fontWeight: 'bold',
},

  spacing: {
    marginVertical: 10,
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
    right: -100,
    transform: [{ rotate: '45deg' }],
  },
  blob3: {
    width: 200,
    height: 200,
    backgroundColor: '#B3C1B7',
    bottom: -50,
    left: -60,
    transform: [{ rotate: '15deg' }],
  },
  blob4: {
    width: 160,
    height: 160,
    backgroundColor: '#A3B8B1',
    bottom: 100,
    right: -40,
    transform: [{ rotate: '-20deg' }],
  },
  blob5: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFDF6',
    bottom: 50,
    left: 130,
    transform: [{ rotate: '30deg' }],
  },
});

export default LandingScreen;
