// src/screens/ZonesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import $api from '../api';
import { useAuthStore } from '../store/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ZonesStackParamList } from '../navigation/ZonesStack';

type Zone = { id: number; name: string; type: string; building_id: number };
type Props = NativeStackScreenProps<ZonesStackParamList, 'ZonesList'>;

export default function ZonesScreen({ navigation }: Props) {  
  const { userId } = useAuthStore();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  /* ──────────── fetch once ──────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await $api.get<Zone[]>(`/zones/${userId}/users`);
        setZones(data);
      } catch (e: any) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ──────────── actions ──────────── */
  const openDoor = async (zone: Zone) => {
    try {
      await $api.post(`/doors/${zone.id}/open`, null, {
        params: { user_id: userId }, // …/open?user_id=2
      });
      Alert.alert('Success', `Zone “${zone.name}” opened!`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  /* ──────────── ui ──────────── */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={zones}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Мої доступні зони</Text>
          <Text style={styles.subtitle}>
            Торкніться картки, щоб відімкнути двері&nbsp;🔑
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ZoneDoors', {
              zoneId: item.id,
              zoneName: item.name,
            })
          }

          style={styles.card}

        >
          <View>
            <Text style={styles.zoneName}>{item.name}</Text>
            <Text style={styles.zoneType}>{item.type}</Text>
          </View>
          <Text style={styles.open}>Open</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={{ color: '#666' }}>No zones available&nbsp;😔</Text>
        </View>
      }
    />
  );
}

/* ──────────── styles ──────────── */
const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 24 },
  header: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#666', marginTop: 4 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    /* elevation для Android / shadow* для iOS */
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  zoneName: { fontSize: 16, fontWeight: '600' },
  zoneType: { color: '#888' },
  open: { color: '#007AFF', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
