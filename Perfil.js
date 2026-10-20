import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Avatar, Text, TextInput, Button, Divider, IconButton } from 'react-native-paper';

// campo de imagem
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './context/AuthContext';
import { request } from './context/AuthContext';

const Perfil = ({ navigation }) => {

    // Dados do usuário -> receber os dados via banco de dados
    const { user, setUser, signOut } = useAuth();
    const [nome, setNome] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [senha, setSenha] = useState('');

    // Imagem do usuário
    const [imagem, setImagem] = useState(null);

    // ==============================
    // ESCOLHER IMAGEM
    // ==============================

    const editarFoto = async () => {
        // Solicita permissão para acessar a galeria
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissao.granted) {
            alert('Precisamos de permissão para acessar suas fotos.');
            return;
        }
        // Abre a galeria
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        // Verifica se o usuário escolheu uma imagem
        if (!resultado.canceled) {
            setImagem(resultado.assets[0].uri);
        }

    };

    // ==============================
    // SALVAR PERFIL
    // ==============================

    const salvarPerfil = () => {
        request('/auth/me', { method: 'PUT', body: JSON.stringify({ name: nome, avatar: imagem || '', ...(senha ? { password: senha } : {}) }) })
            .then(({ user: updated }) => { setUser(updated); alert('Perfil atualizado com sucesso!'); })
            .catch((error) => alert(error.message));

    };


    return (
        <ScrollView style={styles.container}>
            {/* CABEÇALHO */}
            <View style={styles.cabecalho}>
                {/* AVATAR */}
                <View style={styles.avatarContainer}>
                    { imagem ? ( 
                          // Mostra a imagem escolhida
                        <Image
                            source={{ uri: imagem }}
                            style={styles.avatarImagem}
                        />) : (
                        // Avatar padrão
                        <Avatar.Icon
                            size={100}
                            icon="account"
                            style={styles.avatar}
                            color="#FFFFFF"
                        />

                    )}
                    {/* BOTÃO EDITAR */}
                    <IconButton
                        icon="pencil"
                        iconColor="#FFFFFF"
                        size={18}
                        style={styles.botaoEditar}
                        onPress={editarFoto}
                    />

                </View>

                {/* TÍTULO */}
                <Text
                    variant="headlineSmall"
                    style={styles.titulo}
                >
                    Meu Perfil
                </Text>


                <Text style={styles.subtitulo}>
                    Atualize seus dados pessoais
                </Text>

            </View>

            <Divider style={{ backgroundColor: '#2C2C2C' }} />

            {/* ============================= */}
            {/* FORMULÁRIO */}
            {/* ============================= */}

            <View style={styles.formulario}>

                {/* NOME */}

                <TextInput
                    label="Nome"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    textColor="#F3F4F6"
                    activeOutlineColor="#8B5CF6" // Cor da borda ao focar
                    outlineColor="#2C2C2C" // Cor da borda normal
                    left={
                        <TextInput.Icon icon="account" color="#9CA3AF" />
                    }
                    style={styles.input}
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }} // Cor do placeholder
                />


                {/* E-MAIL */}

                <TextInput
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textColor="#F3F4F6"
                    activeOutlineColor="#8B5CF6"
                    outlineColor="#2C2C2C"
                    left={
                        <TextInput.Icon icon="email" color="#9CA3AF" />
                    }
                    style={styles.input}
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
                />

                {/* NOVA SENHA */}

                <TextInput
                    label="Nova senha"
                    value={senha}
                    onChangeText={setSenha}
                    mode="outlined"
                    secureTextEntry
                    textColor="#F3F4F6"
                    activeOutlineColor="#8B5CF6"
                    outlineColor="#2C2C2C"
                    left={
                        <TextInput.Icon icon="lock" color="#9CA3AF" />
                    }
                    style={styles.input}
                    theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
                />


                {/* ============================= */}
                {/* SALVAR */}
                {/* ============================= */}

                <Button
                    mode="contained"
                    icon="content-save"
                    onPress={salvarPerfil}
                    buttonColor="#8B5CF6" // Cor pelo prop para evitar erro
                    textColor="#FFFFFF"
                    style={styles.botao}
                >
                    Salvar alterações
                </Button>


                {/* ============================= */}
                {/* VOLTAR */}
                {/* ============================= */}

                <Button
                    mode="outlined"
                    icon="arrow-left"
                    onPress={() => navigation.goBack()}
                    textColor="#8B5CF6"
                    style={styles.botaoVoltar}
                >
                    Voltar
                </Button>

            </View>

        </ScrollView>
    );
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#121212', // Fundo principal escuro
    },

    // ==============================
    // CABEÇALHO
    // ==============================

    cabecalho: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#1E1E1E', // Destaque no cabeçalho
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2C', // Divisão suave
    },

    // ==============================
    // AVATAR
    // ==============================

    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },

    avatar: {
        backgroundColor: '#2A2A2A', // Cinza para o avatar sem foto
    },

    // Imagem escolhida
    avatarImagem: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#1E1E1E', // Borda da mesma cor do cabeçalho
    },

    // ==============================
    // BOTÃO EDITAR
    // ==============================

    botaoEditar: {
        position: 'absolute',
        right: -8,
        bottom: -8,
        backgroundColor: '#8B5CF6', // Roxo de destaque
        margin: 0,
        borderWidth: 2,
        borderColor: '#1E1E1E', // Borda combinando com o fundo
    },

    // ==============================
    // TÍTULO
    // ==============================

    titulo: {
        color: '#F3F4F6', // Texto claro
        fontWeight: 'bold',
    },

    subtitulo: {
        color: '#9CA3AF', // Cinza médio
        marginTop: 5,
    },

    // ==============================
    // FORMULÁRIO
    // ==============================

    formulario: {
        padding: 20,
    },

    input: {
        marginBottom: 15,
        backgroundColor: '#1E1E1E', // Fundo do input adaptado
    },

    // ==============================
    // BOTÃO SALVAR
    // ==============================

    botao: {
        marginTop: 10,
        paddingVertical: 5,
        borderRadius: 12, // Borda arredondada suave
    },

    // ==============================
    // BOTÃO VOLTAR
    // ==============================

    botaoVoltar: {
        marginTop: 15,
        paddingVertical: 5,
        borderRadius: 12,
        borderColor: '#8B5CF6',
        borderWidth: 1,
    },

});

export { Perfil };