// src/screens/ZoneDoorsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ZonesStackParamList } from '../navigation/ZonesStack';
import $api from '../api';
import { useAuthStore } from '../store/auth';

type Door = { id: number; position: string; device_id: string; zone_id: number };

type Props = NativeStackScreenProps<ZonesStackParamList, 'ZoneDoors'>;

export default function ZoneDoorsScreen({ route }: Props) {
  const { zoneId } = route.params;
  const { userId } = useAuthStore();
  const [doors, setDoors] = useState<Door[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await $api.get<Door[]>(`/doors/zone/${zoneId}`);
        setDoors(data);
      } catch (e: any) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [zoneId]);

  const openDoor = async (door: Door) => {
    try {
      await $api.post(`/doors/${door.device_id}/open`, null, {
        params: { user_id: userId },
      });
      Alert.alert('Success', `Door ${door.device_id} opened!`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={doors}
      keyExtractor={(d) => d.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => openDoor(item)}
          style={styles.card}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.doorId}>{item.device_id}</Text>
            <Text style={styles.position}>{item.position}</Text>
          </View>
          <Text style={styles.open}>Open</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No doors in this zone</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  doorId: { fontSize: 16, fontWeight: '600' },
  position: { color: '#666', marginTop: 2 },
  open: { color: '#007AFF', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
