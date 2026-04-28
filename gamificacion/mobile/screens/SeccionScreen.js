 import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../utils/api';
import { colors, global } from '../utils/styles';

export default function SeccionScreen({ navigation }) {

  const guardarCategoria = async (categoriaId) => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);
      await axios.patch(`${API}/users/${user.Id}/`, { categoria_activa: categoriaId });
      user.categoria_activa = categoriaId;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Home');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView style={global.background} contentContainerStyle={styles.container}>
      <Text style={global.title}>LevelUp Crew</Text>
      <Text style={global.subtitle}>¿En qué quieres enfocarte?</Text>

      <TouchableOpacity style={styles.btn} onPress={() => guardarCategoria(1)}>
        <Text style={styles.btnText}>💪 Salud</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => guardarCategoria(2)}>
        <Text style={styles.btnText}>🧠 Mente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => guardarCategoria(3)}>
        <Text style={styles.btnText}>✅ Hábitos</Text>
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
  btn: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
