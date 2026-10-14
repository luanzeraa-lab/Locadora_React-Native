import {useState} from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Avatar, Text, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';
const CabecalhoMenu = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const [dialogSair, setDialogSair] = useState(false);

  const confirmarSaida = () => {
    setDialogSair(false);
    signOut();
    navigation.navigate('Início', { screen: 'Acesso' });
  };



  return (

    <View style={styles.container}>

      {/* Área do usuário */}
      <View style={styles.usuario}>
        {/* Avatar */}
        <Avatar.Icon
          size={65}
          icon="account"
          style={styles.avatar}
        />

        {/* Nome e e-mail */}
        <View style={styles.informacoes}>

          <Text
            variant="titleMedium"
            style={styles.nome}
          >
            {user?.name || 'Visitante'}
          </Text>

          <Text
            variant="bodyMedium"
            style={styles.email}
            numberOfLines={1}
          >
            {user?.email || 'Faça login para administrar'}
          </Text>

        </View>

      </View>


      {/* Área do perfil */}
      <View style={styles.perfil}>
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Meu perfil
        </Text>
        <IconButton
          icon="account"
          iconColor="white"
          size={24}
          onPress={() => navigation.navigate('Início', { screen: user ? 'Perfil' : 'Acesso' })}
        />
      </View>


      {/* Área do Notificação */}
      <View style={styles.perfil}>
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Notificação
        </Text>
        <IconButton
          icon="bell"
          iconColor="white"
          size={24}
          onPress={() => {}}
        />
      </View>

      {/* Área do Pesquisa */}
      <View style={styles.perfil}>
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Pesquisa
        </Text>
        <IconButton
          icon="magnify"
          iconColor="white"
          size={24}
          onPress={() => navigation.navigate('Início', { screen: 'Pesquisa' })}
        />
      </View>

      {user ? (
        <View style={styles.perfil}>
          <Text
            variant="bodyMedium"
            style={styles.perfilTexto}>
            Gerenciar conteúdos
          </Text>
          <IconButton
            icon="playlist-plus"
            iconColor="white"
            size={24}
            onPress={() => navigation.navigate('Início', { screen: 'Gerenciar conteúdos' })}
          />
        </View>
      ) : null}

      {/* Área do sair */}
      <View style={styles.perfil}>
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Sair
        </Text>
        <IconButton
          icon="logout"
          iconColor="white"
          size={24}
          onPress={() => setDialogSair(true)}
        />

      </View>


      {/* Dialog de confirmação */}
      <Portal>
        <Dialog
          visible={dialogSair}
          onDismiss={() => setDialogSair(false)}>
          <Dialog.Title>Confirmar saída</Dialog.Title>
          <Dialog.Content>
            <Text>
              Deseja realmente sair do aplicativo?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDialogSair(false)}>
              Cancelar
            </Button>

            <Button
              onPress={confirmarSaida}   >
              Sair
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
};


const styles = StyleSheet.create({

  container: {
    backgroundColor: '#C0C0C0',
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    backgroundColor: '#F2A900',
  },

  informacoes: {
    flex: 1,
    marginLeft: 15,
  },

  nome: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 19,
  },

  email: {
    color: '#FFFFFF',
    marginTop: 3,
  },

  perfil: {
    marginTop: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  perfilTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});

export { CabecalhoMenu };