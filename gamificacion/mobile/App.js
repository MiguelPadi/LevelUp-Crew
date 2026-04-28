import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import SeccionScreen from './screens/SeccionScreen';
import HomeScreen from './screens/HomeScreen';
import TareasScreen from './screens/TareasScreen';
import RankingScreen from './screens/RankingScreen';
import PerfilScreen from './screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Seccion" component={SeccionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tareas" component={TareasScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
