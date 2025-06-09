// src/navigation/ZonesStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ZonesScreen from '../screens/ZonesScreen';
import ZoneDoorsScreen from '../screens/ZoneDoorsScreen';


export type ZonesStackParamList = {
  ZonesList: undefined;
  ZoneDoors: { zoneId: number; zoneName: string };
};

const Stack = createNativeStackNavigator<ZonesStackParamList>();

export default function ZonesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ZonesList"
        component={ZonesScreen}
        options={{ title: 'Зони' }}
      />
      <Stack.Screen
        name="ZoneDoors"
        component={ZoneDoorsScreen}
        options={({ route }) => ({ title: route.params.zoneName })}
      />
    </Stack.Navigator>
  );
}
