 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API = 'http://10.0.2.2:5000/api'; // Android emulator
// Si usas dispositivo físico cambia por tu IP local: 'http://192.168.x.x:5000/api'

export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('categoria');
};