 import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ImageBackground
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../utils/api';
import { colors, global } from '../utils/styles';

export default function LoginScreen({ navigation }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const iniciarSesion = async () => {
    try {
      const res = await axios.get(`${API}/users/`);
      const user = res.data.find(u => u.email === email);
      if (!user) { Alert.alert('Error', 'Usuario no encontrado'); return; }
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  const crearUsuario = async () => {
    try {
      const res = await axios.get(`${API}/users/`);
      const nameExists = res.data.some(u => u.name.toLowerCase() === name.toLowerCase());
      if (nameExists) { Alert.alert('Error', 'Ese nombre ya existe'); return; }
      const nuevo = await axios.post(`${API}/users/`, { name, email, password, level: '1', xp: 0 });
      await AsyncStorage.setItem('user', JSON.stringify(nuevo.data));
      navigation.replace('Seccion');
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el usuario');
    }
  };

  return (
    <ScrollView style={global.background} contentContainerStyle={styles.container}>

      <Text style={styles.title}>LevelUp Crew</Text>
      <Text style={global.subtitle}>Empieza tu progreso hoy 🚀</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'login' && styles.tabActive]}
          onPress={() => setTab('login')}>
          <Text style={global.btnText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'registro' && styles.tabActive]}
          onPress={() => setTab('registro')}>
          <Text style={global.btnText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* LOGIN */}
      {tab === 'login' ? (
        <View>
          <TextInput style={global.input} placeholder="Correo" placeholderTextColor="#aaa"
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={global.input} placeholder="Contraseña" placeholderTextColor="#aaa"
            value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.btn} onPress={iniciarSesion}>
            <Text style={global.btnText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput style={global.input} placeholder="Nombre de usuario" placeholderTextColor="#aaa"
            value={name} onChangeText={setName} />
          <TextInput style={global.input} placeholder="Correo" placeholderTextColor="#aaa"
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={global.input} placeholder="Contraseña" placeholderTextColor="#aaa"
            value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.btn} onPress={crearUsuario}>
            <Text style={global.btnText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DIVIDER */}
      <Text style={styles.divider}>o continúa con</Text>

      <TouchableOpacity style={styles.btnGoogle}>
        <Text style={styles.btnGoogleText}>Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnApple}>
        <Text style={global.btnText}>Apple</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.input,
  },
  tabActive: {
    backgroundColor: colors.secondary,
  },
  btn: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    color: colors.grayDark,
    marginVertical: 20,
    fontSize: 12,
  },
  btnGoogle: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  btnGoogleText: {
    color: 'black',
    fontWeight: 'bold',
  },
  btnApple: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
