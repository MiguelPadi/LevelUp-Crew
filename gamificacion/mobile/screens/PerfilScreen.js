 import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../utils/api';
import { colors, global } from '../utils/styles';
import BottomNav from '../components/BottomNav';

export default function PerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ racha: 0, logros: 0, tareas: 0 });
  const [xpEnNivel, setXpEnNivel] = useState(0);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    const userStr = await AsyncStorage.getItem('user');
    const u = JSON.parse(userStr);
    setUser(u);

    const xpTotal = u.xp || 0;
    setXpEnNivel(xpTotal % 100);

    const res = await axios.get(`${API}/accomplishments/`);
    const misLogros = res.data.filter(l => l.Id_Users === u.Id && l.completed);

    let racha = 0;
    let fechaCheck = new Date();
    while (true) {
      const fechaStr = fechaCheck.toISOString().split('T')[0];
      const tiene = misLogros.some(l => l.Create_at.startsWith(fechaStr));
      if (!tiene) break;
      racha++;
      fechaCheck.setDate(fechaCheck.getDate() - 1);
    }

    const diasUnicos = new Set(misLogros.map(l => l.Create_at.split('T')[0])).size;
    setStats({ racha, logros: diasUnicos, tareas: misLogros.length });
  };

  if (!user) return null;

  const xpTotal = user.xp || 0;
  const level = Math.floor(xpTotal / 100) + 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={global.container}>

        {/* PERFIL */}
        <View style={styles.profileMain}>
          <Text style={styles.avatarLarge}>🦦</Text>
          <Text style={global.title}>{user.name}</Text>
          <Text style={global.grayText}>Nivel {level}</Text>
        </View>

        {/* XP */}
        <View style={global.card}>
          <Text style={styles.cardTitle}>Progreso</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpProgress, { width: `${xpEnNivel}%` }]} />
          </View>
          <Text style={global.grayText}>{xpEnNivel} / 100 XP</Text>
        </View>

        {/* STATS */}
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>🔥 {stats.racha}</Text>
            <Text style={global.grayText}>Racha</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>🏆 {stats.logros}</Text>
            <Text style={global.grayText}>Logros</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>✅ {stats.tareas}</Text>
            <Text style={global.grayText}>Tareas</Text>
          </View>
        </View>

      </ScrollView>
      <BottomNav navigation={navigation} active="Perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  profileMain: { alignItems: 'center', marginBottom: 20 },
  avatarLarge: { fontSize: 80, marginBottom: 10 },
  cardTitle: { color: colors.white, fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  xpBar: { height: 10, backgroundColor: colors.input, borderRadius: 10, overflow: 'hidden', marginBottom: 8 },
  xpProgress: { height: '100%', backgroundColor: colors.primary },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, gap: 10 },
  statBox: { flex: 1, backgroundColor: colors.bgCard, borderRadius: 15, padding: 10, alignItems: 'center' },
  statNum: { color: colors.white, fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
});
