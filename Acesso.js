import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';

const Acesso = ({ navigation }) => {

    return (
        // Usar height: '100%' no lugar de flex: 1 evita que a tela suma no Expo Web
        <View style={{ height: '100%', backgroundColor: '#121212' }}> 
            
            {/* APPBAR */}
            <Appbar.Header style={{ backgroundColor: '#1E1E1E' }}>
                <Appbar.BackAction
                    iconColor="#F3F4F6"
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content
                    title="Acesso"
                    titleStyle={{ color: '#F3F4F6' }} 
                 />
            </Appbar.Header>

            {/* CONTEÚDO */}
            <View style={styles.acesso}>
                <Text
                    variant="headlineSmall"
                    style={styles.acessoTitulo}
                >
                    Bem-vindo!
                </Text>
                <Text
                    variant="bodyLarge"
                    style={styles.acessoTexto}>
                    Você já possui uma conta?
                </Text>
                
                {/* JÁ TENHO CADASTRO */}
                 <Button
                    mode="contained"
                    icon="login"
                    // Passamos a cor de fundo pela style para evitar erros de versão do Paper
                    style={[styles.acessoButton, { backgroundColor: '#8B5CF6' }]} 
                    labelStyle={{ color: '#FFFFFF' }} // Cor do texto segura
                    onPress={() => navigation.navigate('Login')}
                >
                    JÁ TENHO CADASTRO
                </Button>

                {/* NÃO TENHO CADASTRO */}
                <Button
                    mode="outlined"
                    icon="account-plus"
                    // Retiramos a cor de fundo aqui e adicionamos a borda roxa
                    style={[styles.acessoButton, { backgroundColor: 'transparent', borderColor: '#8B5CF6', borderWidth: 1 }]} 
                    labelStyle={{ color: '#8B5CF6' }} // Cor do texto/ícone segura
                    onPress={() => navigation.navigate('Cadastro')}
                >
                    NÃO TENHO CADASTRO
                </Button>

            </View>

        </View>
    );
};

export default Acesso;