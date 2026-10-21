import React from 'react';

import { View } from 'react-native';

import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';
import { useAuth } from './context/AuthContext';

const Cadastro = ({ navigation }) => {

    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [confirmarSenha, setConfirmarSenha] = React.useState('');

    const [mostrarSenha, setMostrarSenha] = React.useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = React.useState(false);
    const { signUp } = useAuth();
    const [sending, setSending] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const cadastrar = async () => {
        setErrorMessage('');
        if (!nome.trim() || !email.trim() || !senha) {
            setErrorMessage('Preencha todos os campos.');
            return;
        }
        if (senha.length < 6) {
            setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (senha !== confirmarSenha) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }
        setSending(true);
        try {
            await signUp(nome.trim(), email.trim(), senha);
            navigation.replace('Home');
        } catch (error) {
            setErrorMessage(error.message || 'Não foi possível cadastrar.');
        } finally {
            setSending(false);
        }
    };

    return (

        <View style={styles.cadastroContainer}>

            {/* APPBAR */}

            <Appbar.Header style={styles.header}>

                <Appbar.BackAction
                    iconColor="white"
                    onPress={() => navigation.goBack()}
                />

                <Appbar.Content
                    title="Cadastro"
                    titleStyle={styles.title}
                />

            </Appbar.Header>


            {/* FORMULÁRIO */}

            <View style={styles.cadastroContent}>

                <Text
                    variant="headlineMedium"
                    style={styles.cadastroTitulo}
                >
                    Criar conta
                </Text>


                <Text
                    variant="bodyLarge"
                    style={styles.cadastroTexto}
                >
                    Preencha os dados abaixo
                </Text>

                {errorMessage ? (
                    <Text style={{ color: '#F87171', marginBottom: 15, textAlign: 'center' }}>
                        {errorMessage}
                    </Text>
                ) : null}


                {/* NOME */}

                <TextInput
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    textColor="#F3F4F6"
                    activeOutlineColor="#8B5CF6"
                    outlineColor="#2C2C2C"
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
                    left={
                        <TextInput.Icon icon="account" />
                    }
                    style={styles.input}
                />


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
                    activeOutlineColor="#8B5CF6"
                    outlineColor="#2C2C2C"
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
                    left={
                        <TextInput.Icon icon="email" />
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
                        <TextInput.Icon icon="lock" />
                    }
                    right={
                        <TextInput.Icon
                            icon={mostrarSenha ? 'eye-off' : 'eye'}
                            onPress={() =>
                                setMostrarSenha(!mostrarSenha)
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* CONFIRMAR SENHA */}

                <TextInput
                    label="Confirmar senha"
                    placeholder="Digite novamente sua senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarConfirmacao}
                    textColor="#F3F4F6"
                    activeOutlineColor="#8B5CF6"
                    outlineColor="#2C2C2C"
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
                    left={
                        <TextInput.Icon icon="lock-check" />
                    }
                    right={
                        <TextInput.Icon
                            icon={
                                mostrarConfirmacao
                                    ? 'eye-off'
                                    : 'eye'
                            }
                            onPress={() =>
                                setMostrarConfirmacao(
                                    !mostrarConfirmacao
                                )
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* CADASTRAR */}

                <Button
                    mode="contained"
                    icon="account-plus"
                    style={styles.cadastroButton}
                    onPress={cadastrar}
                    loading={sending}
                    disabled={sending}
                >
                    CADASTRAR
                </Button>


                {/* JÁ POSSUI CONTA */}

                <Button
                    mode="text"
                    icon="login"
                    onPress={() =>
                        navigation.navigate('Login')
                    }
                >
                    JÁ TENHO CADASTRO
                </Button>

            </View>

        </View>
    );
};

export default Cadastro;