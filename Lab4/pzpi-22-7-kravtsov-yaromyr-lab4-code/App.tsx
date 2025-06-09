// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import ZonesScreen from './src/screens/ZonesScreen';

import { useAuthStore } from './src/store/auth';
import DoorsScreen from './src/screens/DoorsScreen';
import ZonesStack from './src/navigation/ZonesStack';

export type RootStackParamList = {
  Login: undefined;
  Zones: undefined;
  Doors: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App() {
  const loggedIn = useAuthStore((s) => s.loggedIn);

  // якщо ще не авторизований – показуємо лише Login
  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
  name="Login"
  component={LoginScreen}
  options={{ tabBarStyle: { display: 'none' }, headerShown: false }}
/>

        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  // після логіну – показуємо нижні вкладки
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          // ⬇︎ сховати іконку й залишити лише напис
          tabBarIcon: () => null,          // повертаємо null
          tabBarLabelStyle: { fontSize: 14 },
        }}
      >
        <Tab.Screen name="Zones" component={ZonesStack} options={{ title: 'Зони' }} />
        <Tab.Screen
          name="Doors"
          component={DoorsScreen}
          options={{ title: 'Відкрити двері' }}
        />
      </Tab.Navigator>

    </NavigationContainer>
  );
}
