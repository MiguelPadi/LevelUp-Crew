 
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../utils/api';
import { colors, global } from '../utils/styles';
import BottomNav from '../components/BottomNav';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [completadasHoy, setCompletadasHoy] = useState([]);
  const [progreso, setProgreso] = useState({ semana: Array(7).fill(0), racha: 0, xpHoy: 0 });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const userStr = await AsyncStorage.getItem('user');
    const u = JSON.parse(userStr);
    setUser(u);

    const categoriaActiva = u.categoria_activa || 1;
    const hoy = new Date().toISOString().split('T')[0];

    const [actRes, logRes] = await Promise.all([
      axios.get(`${API}/activities/`),
      axios.get(`${API}/accomplishments/`)
    ]);

    const actFiltradas = actRes.data.filter(a => a.Id_Category === categoriaActiva);
    const misLogros = logRes.data.filter(l => l.Id_Users === u.Id && l.completed);
    const hoyIds = misLogros.filter(l => l.Create_at.startsWith(hoy)).map(l => l.Id_activity);

    setActividades(actFiltradas);
    setCompletadasHoy(hoyIds);

    // Progreso semanal
    const semana = Array(7).fill(0);
    const ahora = new Date();
    misLogros.forEach(l => {
      const fecha = new Date(l.Create_at);
      const diff = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
      if (diff < 7) {
        const dia = (fecha.getDay() + 6) % 7;
        semana[dia] += 10;
      }
    });

    let racha = 0;
    let fechaCheck = new Date();
    while (true) {
      const fechaStr = fechaCheck.toISOString().split('T')[0];
      const tiene = misLogros.some(l => l.Create_at.startsWith(fechaStr));
      if (!tiene) break;
      racha++;
      fechaCheck.setDate(fechaCheck.getDate() - 1);
    }

    setProgreso({ semana, racha, xpHoy: semana[(ahora.getDay() + 6) % 7] });
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
      setCompletadasHoy([...completadasHoy, activityId]);
      Alert.alert('✅ Completado', `+${res.data.xp_ganado} XP ganados!`);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'No se pudo completar');
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('categoria');
    navigation.replace('Login');
  };

  if (!user) return null;

  const xpTotal = user.xp || 0;
  const level = Math.floor(xpTotal / 100) + 1;
  const xpEnNivel = xpTotal % 100;
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const maxXP = Math.max(...progreso.semana, 1);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={global.container}>

        {/* NIVEL */}
        <Text style={styles.levelTitle}>LEVEL {level}</Text>
        <View style={styles.xpBar}>
          <View style={[styles.xpProgress, { width: `${xpEnNivel}%` }]} />
        </View>

        {/* PERFIL */}
        <View style={[global.card, global.row]}>
          <Text style={styles.avatar}>🦦</Text>
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={global.grayText}>Nivel {level}</Text>
          </View>
          <Text style={global.xpText}>+{xpTotal} XP</Text>
        </View>

        {/* MISIONES */}
        <View style={global.card}>
          <Text style={styles.cardTitle}>Misiones de hoy</Text>
          {actividades.length === 0 && <Text style={global.grayText}>No hay misiones disponibles.</Text>}
          {actividades.map(t => {
            const hecha = completadasHoy.includes(t.Id);
            return (
              <View key={t.Id} style={styles.missionRow}>
                <Text style={[global.whiteText, hecha && styles.done]}>{t.Name}</Text>
                <TouchableOpacity
                  style={[styles.btnCompletar, hecha && styles.btnHecho]}
                  onPress={() => !hecha && completarMision(t.Id)}
                  disabled={hecha}>
                  <Text style={styles.btnCompletarText}>{hecha ? '✅ Hecho' : `+${t.xp} XP`}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* PROGRESO */}
        <View style={global.card}>
          <View style={global.row}>
            <Text style={styles.cardTitle}>Progreso diario</Text>
            <Text style={global.xpText}>+{progreso.xpHoy} XP hoy</Text>
          </View>
          <View style={styles.chart}>
            {progreso.semana.map((xp, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={[styles.bar, { height: `${Math.max((xp / maxXP) * 100, 5)}%` }]} />
                <Text style={styles.barLabel}>{dias[i]}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.streak}>🏆 Racha actual: {progreso.racha} días</Text>
        </View>

        {/* PREMIUM */}
        <View style={styles.premiumCard}>
          <View style={global.row}>
            <Text style={styles.cardTitle}>🔥 Misiones Premium</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>PRO</Text></View>
          </View>
          <Text style={global.grayText}>Desbloquea misiones avanzadas y gana el doble de XP</Text>
          <TouchableOpacity style={styles.btnPremium}>
            <Text style={styles.btnPremiumText}>Desbloquear por $2.99</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <BottomNav navigation={navigation} active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  levelTitle: { color: colors.white, fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  xpBar: { height: 10, backgroundColor: colors.input, borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  xpProgress: { height: '100%', backgroundColor: colors.primary },
  avatar: { fontSize: 40 },
  userName: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  cardTitle: { color: colors.white, fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  missionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  done: { opacity: 0.5, textDecorationLine: 'line-through' },
  btnCompletar: { backgroundColor: '#6c63ff', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12 },
  btnHecho: { backgroundColor: '#444' },
  btnCompletarText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 80, marginVertical: 10, gap: 5 },
  barContainer: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: colors.primary, borderRadius: 5 },
  barLabel: { color: colors.gray, fontSize: 10, marginTop: 3 },
  streak: { color: colors.gray, fontWeight: 'bold', marginTop: 5 },
  premiumCard: { backgroundColor: 'rgba(124,58,237,0.2)', borderRadius: 20, padding: 15, marginTop: 15, borderWidth: 1, borderColor: colors.border },
  badge: { backgroundColor: colors.secondary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: colors.white, fontSize: 12 },
  btnPremium: { backgroundColor: 'gold', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 10 },
  btnPremiumText: { color: 'black', fontWeight: 'bold' },
});