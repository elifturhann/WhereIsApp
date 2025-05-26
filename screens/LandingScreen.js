import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Add Items"
        onPress={() => navigation.navigate('AddItem')}
      />
      <View style={styles.spacing} />
      <Button
        title="List Items"
        onPress={() => navigation.navigate('ListItems')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  spacing: {
    marginVertical: 10,
  },
});

export default LandingScreen;
