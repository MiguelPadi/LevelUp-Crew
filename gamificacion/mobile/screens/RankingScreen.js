 import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../utils/api';
import { colors, global } from '../utils/styles';
import BottomNav from '../components/BottomNav';

export default function RankingScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    const userStr = await AsyncStorage.getItem('user');
    const u = JSON.parse(userStr);
    setCurrentUser(u);
    const res = await axios.get(`${API}/users/`);
    const ordenados = res.data.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    setUsers(ordenados);
  };

  const medallas = ['🥇', '🥈', '🥉'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={global.container}>

        <Text style={[global.title, { textAlign: 'center' }]}>🏆 Ranking Global</Text>
        <Text style={[global.grayText, { textAlign: 'center', marginBottom: 20 }]}>Compite y sube de nivel</Text>

        {/* TOP 3 */}
        <View style={styles.top3}>
          {[users[1], users[0], users[2]].map((u, i) => {
            if (!u) return null;
            const pos = i === 0 ? 1 : i === 1 ? 0 : 2;
            const esYo = currentUser && u.Id === currentUser.Id;
            return (
              <View key={u.Id} style={[styles.topUser, esYo && styles.activeUser]}>
                <Text style={styles.topAvatar}>🦦</Text>
                <Text style={styles.medalla}>{medallas[pos]}</Text>
                <Text style={global.whiteText}>{u.name}</Text>
                <Text style={global.xpText}>{u.xp || 0} XP</Text>
              </View>
            );
          })}
        </View>

        {/* LISTA */}
        <View style={global.card}>
          {users.slice(3).map((u, i) => {
            const esYo = currentUser && u.Id === currentUser.Id;
            return (
              <View key={u.Id} style={[styles.rankItem, esYo && styles.activeUser]}>
                <Text style={global.whiteText}>#{i + 4}</Text>
                <Text style={styles.rankAvatar}>🦦</Text>
                <Text style={[global.whiteText, { flex: 1 }]}>{u.name}</Text>
                <Text style={global.xpText}>{u.xp || 0} XP</Text>
              </View>
            );
          })}
        </View>

      </ScrollView>
      <BottomNav navigation={navigation} active="Ranking" />
    </View>
  );
}

const styles = StyleSheet.create({
  top3: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 20 },
  topUser: { alignItems: 'center', padding: 10 },
  topAvatar: { fontSize: 40 },
  medalla: { fontSize: 20, marginVertical: 5 },
  activeUser: { backgroundColor: 'rgba(56,189,248,0.2)', borderRadius: 10, padding: 8 },
  rankItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 },
  rankAvatar: { fontSize: 24 },
});
