import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuthStore } from '../store/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = useAuthStore((s) => s.login);
    const isLoading = useAuthStore((s) => s.isLoading);
    const authError = useAuthStore((s) => s.authError);
    const userId = useAuthStore((s) => s.userId);


    const onLogin = async () => {
        try {
            await login(email, password);
        
            navigation.replace('Zones');
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <Button title="Login" onPress={onLogin} />
            )}
            {authError && (
                <View style={{ marginTop: 12 }}>
                    <Button
                        title="Retry"
                        onPress={onLogin}
                        color="red"
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: Platform.select({ ios: 8, android: 4 }),
    },
});
