import 'react-native-gesture-handler';

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LandingScreen from '../../screens/LandingScreen';
import AddItemScreen from '../../screens/AddItemScreen';
import ListItemScreen from '../../screens/ListItemScreen';
import ItemDetailScreen from '../../screens/ItemDetailScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <SafeAreaProvider>
      
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="AddItem" component={AddItemScreen} />
          <Stack.Screen name="ListItems" component={ListItemScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        </Stack.Navigator>
      
    </SafeAreaProvider>
  );
}
