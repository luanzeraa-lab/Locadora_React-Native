import { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';

const CabecalhoMenu = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const [dialogSair, setDialogSair] = useState(false);

  const confirmarSaida = async () => {
    setDialogSair(false);
    await signOut();
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
          color="#FFFFFF"
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
          iconColor="#F3F4F6"
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
          iconColor="#F3F4F6"
          size={24}
          onPress={() => Alert.alert('Notificações', 'Nenhuma notificação nova.')}
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
          iconColor="#F3F4F6"
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
            iconColor="#F3F4F6"
            size={24}
            onPress={() => navigation.navigate('Início', { screen: 'Gerenciar conteúdos' })}
          />
        </View>
      ) : null}

      {user ? (
        <View style={styles.perfil}>
          <Text variant="bodyMedium" style={styles.perfilTexto}>Sair</Text>
          <IconButton
            icon="logout"
            iconColor="#EF4444"
            size={24}
            onPress={() => setDialogSair(true)}
          />
        </View>
      ) : null}


      {/* Dialog de confirmação */}
      <Portal>
        <Dialog
          visible={dialogSair}
          onDismiss={() => setDialogSair(false)}
          style={{ backgroundColor: '#1E1E1E' }}> {/* Fundo do modal escuro */}
          <Dialog.Title style={{ color: '#F3F4F6' }}>Confirmar saída</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: '#9CA3AF' }}>
              Deseja realmente sair do aplicativo?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor="#9CA3AF"
              onPress={() => setDialogSair(false)}>
              Cancelar
            </Button>

            <Button
              textColor="#EF4444" // Ação destrutiva em vermelho
              onPress={confirmarSaida}>
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
    backgroundColor: '#1E1E1E', // Fundo combinando com o header do tema
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 10,
    // Caso use num Drawer, essa borda arredondada ajuda no acabamento visual
    borderBottomRightRadius: 20, 
  },

  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    backgroundColor: '#2A2A2A', // Fundo escuro para o avatar padrão
  },

  informacoes: {
    flex: 1,
    marginLeft: 15,
  },

  nome: {
    color: '#F3F4F6', // Texto claro
    fontWeight: 'bold',
    fontSize: 19,
  },

  email: {
    color: '#9CA3AF', // Texto secundário acinzentado
    marginTop: 3,
  },

  perfil: {
    marginTop: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C', // Linha separadora mais discreta

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  perfilTexto: {
    color: '#F3F4F6', // Texto dos itens do menu mais legível
    fontWeight: 'bold',
  },

});

export { CabecalhoMenu };