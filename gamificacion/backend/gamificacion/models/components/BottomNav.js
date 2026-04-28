import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../utils/styles';

export default function BottomNav({ navigation, active }) {
  const items = [
    { name: 'Home', icon: '🏠', label: 'Home' },
    { name: 'Ranking', icon: '🏆', label: 'Ranking' },
    { name: 'Tareas', icon: '🎯', label: 'Tareas' },
    { name: 'Perfil', icon: '👤', label: 'Perfil' },
  ];

  return (
    <View style={styles.nav}>
      {items.map(item => (
        <TouchableOpacity key={item.name} style={styles.navItem}
          onPress={() => navigation.navigate(item.name)}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={[styles.label, active === item.name && styles.active]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  navItem: { alignItems: 'center' },
  icon: { fontSize: 20 },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  active: { color: colors.primary },
});