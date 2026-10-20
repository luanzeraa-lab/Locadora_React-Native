import { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';

import { View } from 'react-native';
//React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator,  DrawerContentScrollView } from '@react-navigation/drawer';

import { PaperProvider } from 'react-native-paper';
import { theme } from './theme/theme';

// AppBar
import AppBar from './AppBar';
// Rotas
import Pesquisa from './Pesquisa';
// Acesso
import Acesso from './Acesso';
//Login 
import Login from './Login';
//Cadastro
import Cadastro from './Cadastro';
// Perfil
import { Perfil } from './Perfil';
//cabeçalho do menu
import { CabecalhoMenu } from './CabecaMenu';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import GerenciarConteudos from './GerenciarConteudos';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={AppBar} />
      <Stack.Screen name="Pesquisa" component={Pesquisa} />
      <Stack.Screen name="Acesso" component={Acesso} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Gerenciar conteúdos" component={GerenciarConteudos} />
    </Stack.Navigator>
  );
}


function DrawerNavigation() {
  const { user, loading } = useAuth();
  if (loading) return <SplashScreen />;
  return (
    <Drawer.Navigator screenOptions={{
      headerShown: false
    }}

      drawerContent={(props) => (
        <View style={{ flex: 1 }}>

          <CabecalhoMenu />


          <DrawerContentScrollView {...props} />

        </View>
      )}
    >
      <Drawer.Screen
        name="Início"
        component={StackNavigator}
      />
      <Drawer.Screen
        name="Séries"
        component={StackNavigator}
      />
      {user ? (
        <Drawer.Screen name="Gerenciar conteúdos" component={GerenciarConteudos} />
      ) : null}
    </ Drawer.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (<SplashScreen />)
  }

  return <PaperProvider theme={theme}><AuthProvider><ContentProvider><NavigationContainer>
    <DrawerNavigation />
  </NavigationContainer></ContentProvider></AuthProvider></PaperProvider>;
}
