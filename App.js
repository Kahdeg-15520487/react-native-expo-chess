import React from 'react';
import { AppRegistry, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './containers/Home';
import Training from './containers/Training';
import PlayerVsAI from './containers/PlayerVsAI';
import PlayerVsFriend from './containers/PlayerVsFriend';

// console.disableYellowBox = true;

// const Chess = StackNavigator(
//   {
//     Home: { screen: Home },
//     Training: { screen: Training },
//     PlayerVsAI: { screen: PlayerVsAI },
//     PlayerVsFriend: { screen: PlayerVsFriend },
//   },
//   {
//     mode: 'modal',
//   },
// );

// AppRegistry.registerComponent('Chess', () => Chess);

// export default Chess;

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Training" component={Training} options={({ route }) => ({ title: route.params.name })}/>
        <Stack.Screen name="PlayerVsAI" component={PlayerVsAI} options={({ route }) => ({ title: route.params.name })}/>
        <Stack.Screen name="PlayerVsFriend" component={PlayerVsFriend} options={({ route }) => ({ title: route.params.name })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}