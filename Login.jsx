import React from 'react';
import { Alert, View } from 'react-native';

import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';
import { useAuth } from './context/AuthContext';

const Login = ({ navigation }) => {

    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [mostrarSenha, setMostrarSenha] = React.useState(false);
    const { signIn } = useAuth();
    const [sending, setSending] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const entrar = async () => {
        setErrorMessage('');
        if (!email.trim() || !senha) {
            setErrorMessage('Informe e-mail e senha.');
            return;
        }
        setSending(true);
        try {
            await signIn(email.trim(), senha);
            navigation.replace('Home');
        } catch (error) {
            setErrorMessage(error.message || 'Não foi possível entrar.');
        } finally {
            setSending(false);
        }
    };

    return (

        // Usamos height 100% para evitar o colapso de tela branca no Expo Web
        <View style={{ height: '100%', backgroundColor: '#121212' }}>

            {/* APPBAR */}

            <Appbar.Header style={{ backgroundColor: '#1E1E1E' }}>

                <Appbar.BackAction
                    iconColor="#F3F4F6" // Ícone claro
                    onPress={() => navigation.goBack()}
                />

                <Appbar.Content
                    title="Login"
                    titleStyle={{ color: '#F3F4F6', fontWeight: 'bold' }} // Título claro
                />

            </Appbar.Header>


            {/* FORMULÁRIO */}

            <View style={styles.loginContent}>

                <Text
                    variant="headlineMedium"
                    style={styles.loginTitulo}
                >
                    Bem-vindo!
                </Text>


                <Text
                    variant="bodyLarge"
                    style={styles.loginTexto}
                >
                    Entre com sua conta
                </Text>

                {errorMessage ? (
                    <Text style={{ color: '#F87171', marginBottom: 15, textAlign: 'center' }}>
                        {errorMessage}
                    </Text>
                ) : null}


                {/* E-MAIL */}

                <TextInput
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textColor="#F3F4F6"
                    activeOutlineColor="#8B5CF6" // Borda roxa ao focar
                    outlineColor="#2C2C2C" // Borda cinza em repouso
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }} // Cor do texto do label/placeholder
                    left={
                        <TextInput.Icon icon="email" color="#9CA3AF" />
                    }
                    style={styles.input}
                />


                {/* SENHA */}

                <TextInput
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarSenha}
                    textColor="#F3F4F6"
                    activeOutlineColor="#8B5CF6"
                    outlineColor="#2C2C2C"
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
                    left={
                        <TextInput.Icon icon="lock" color="#9CA3AF" />
                    }
                    right={
                        <TextInput.Icon
                            icon={mostrarSenha ? 'eye-off' : 'eye'}
                            color="#9CA3AF" // Ícone do olhinho na mesma cor secundária
                            onPress={() =>
                                setMostrarSenha(!mostrarSenha)
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* ENTRAR */}

                <Button
                    mode="contained"
                    icon="login"
                    buttonColor="#8B5CF6" // Roxo do tema
                    textColor="#FFFFFF"
                    style={styles.loginButton}
                    onPress={entrar}
                    loading={sending}
                    disabled={sending}
                >
                    ENTRAR
                </Button>


                {/* CADASTRO */}

                <Button
                    mode="text"
                    icon="account-plus"
                    textColor="#8B5CF6" // Texto roxo combinando
                    onPress={() => navigation.navigate('Cadastro')}
                >
                    NÃO TENHO CADASTRO
                </Button>

            </View>

        </View>
    );
};

export default Login;