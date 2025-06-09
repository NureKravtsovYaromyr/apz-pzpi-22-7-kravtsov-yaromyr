// src/screens/DoorsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/auth';
import $api from '../api'; // axios-інстанс із токеном

export default function DoorsScreen() {
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(false);

  // userId беремо із zustand (витягнутий із JWT під час логіну)
  const userId = useAuthStore((s) => s.userId);

  const openDoor = async () => {
    if (!deviceId.trim()) return Alert.alert('Enter device ID');

    setLoading(true);
    try {
      await $api.post(`/doors/${deviceId}/open`, null, {
        params: { user_id: userId },
        timeout: 5000,
      });
      Alert.alert('Success', `Door ${deviceId} opened!`);
      setDeviceId('');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Open Door by Device ID</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. DEV-A1B2C3"
        autoCapitalize="characters"
        value={deviceId}
        onChangeText={setDeviceId}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Open" onPress={openDoor} />
      )}
      <Text style={styles.help}>
        Tip: ID можна одержати зі списку зон / дверей або у swagger бекенду.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: Platform.select({ ios: 8, android: 4 }),
  },
  help: { marginTop: 16, color: '#666', textAlign: 'center', fontSize: 12 },
});
