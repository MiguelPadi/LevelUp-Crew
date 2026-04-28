 import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../utils/api';
import { colors, global } from '../utils/styles';
import BottomNav from '../components/BottomNav';

export default function TareasScreen({ navigation }) {
  const [actividades, setActividades] = useState([]);
  const [logros, setLogros] = useState([]);
  const [user, setUser] = useState(null);
  const [filtro, setFiltro] = useState('hoy');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const userStr = await AsyncStorage.getItem('user');
    const u = JSON.parse(userStr);
    setUser(u);
    const categoriaActiva = u.categoria_activa || 1;
    const [actRes, logRes] = await Promise.all([
      axios.get(`${API}/activities/`),
      axios.get(`${API}/accomplishments/`)
    ]);
    setActividades(actRes.data.filter(a => a.Id_Category === categoriaActiva));
    setLogros(logRes.data.filter(l => l.Id_Users === u.Id && l.completed));
  };

  const completarMision = async (activityId) => {
    try {
      const res = await axios.post(`${API}/mision/completar/`, {
        user_id: user.Id,
        activity_id: activityId
      });
      const updatedUser = { ...user, xp: res.data.xp_total, level: res.data.level };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      await cargarDatos();
      Alert.alert('✅ Completado', `+${res.data.xp_ganado} XP ganados!`);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'No se pudo completar');
    }
  };

  const hoy = new Date().toISOString().split('T')[0];
  const completadasHoy = logros.filter(l => l.Create_at.startsWith(hoy)).map(l => l.Id_activity);
  const todasCompletadas = logros.map(l => l.Id_activity);

  const tareasFiltradas = actividades.filter(t => {
    if (filtro === 'pendientes') return !completadasHoy.includes(t.Id);
    if (filtro === 'completadas') return todasCompletadas.includes(t.Id);
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={global.container}>

        <Text style={[global.title, { textAlign: 'center' }]}>🎯 Mis Tareas</Text>
        <Text style={[global.grayText, { textAlign: 'center', marginBottom: 15 }]}>Completa tus misiones diarias</Text>

        {/* FILTROS */}
        <View style={styles.filters}>
          {['hoy', 'pendientes', 'completadas'].map(f => (
            <TouchableOpacity key={f} style={[styles.filter, filtro === f && styles.filterActive]}
              onPress={() => setFiltro(f)}>
              <Text style={global.whiteText}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LISTA */}
        <View style={global.card}>
          {tareasFiltradas.length === 0 && <Text style={global.grayText}>No hay tareas aquí.</Text>}
          {tareasFiltradas.map(t => {
            const hecha = completadasHoy.includes(t.Id);
            return (
              <View key={t.Id} style={styles.taskItem}>
                <Text style={[global.whiteText, hecha && styles.done]}>{t.Name}</Text>
                <TouchableOpacity
                  style={[styles.btnCompletar, hecha && styles.btnHecho]}
                  onPress={() => !hecha && completarMision(t.Id)}
                  disabled={hecha}>
                  <Text style={styles.btnText}>{hecha ? '✅ Hecho' : `+${t.xp} XP`}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

      </ScrollView>
      <BottomNav navigation={navigation} active="Tareas" />
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 5 },
  filter: { flex: 1, padding: 8, borderRadius: 10, backgroundColor: colors.input, alignItems: 'center' },
  filterActive: { backgroundColor: colors.secondary },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  done: { opacity: 0.5, textDecorationLine: 'line-through' },
  btnCompletar: { backgroundColor: '#6c63ff', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12 },
  btnHecho: { backgroundColor: '#444' },
  btnText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
});
