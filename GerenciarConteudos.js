import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Appbar, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useContents } from './context/ContentContext';
import { useAuth } from './context/AuthContext';
import { uploadImage } from './context/AuthContext';
import { styles } from './css/Styles';

const emptyForm = { title: '', subtitle: '', imageUrl: '', description: '', category: 'Séries' };

export default function GerenciarConteudos({ navigation }) {
  const { createContent } = useContents();
  const { user, loading } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  if (loading) return null;
  if (!user) {
    return (
      <View style={styles.adminContainer}>
        <Text style={styles.emptyText}>Faça login para acessar a área administrativa.</Text>
      </View>
    );
  }

  const save = async () => {
    setStatus(null);
    try {
      await createContent(form);
      setForm(emptyForm);
      setStatus({ type: 'success', message: 'Conteúdo cadastrado com sucesso.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Não foi possível cadastrar o conteúdo.' });
    }
  };

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
    });
    if (result.canceled) return;
    setUploading(true);
    setStatus(null);
    try {
      update('imageUrl', await uploadImage(result.assets[0]));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setUploading(false);
    }
  };

  const cancel = () => {
    setForm(emptyForm);
    setStatus(null);
  };

  return (
    <View style={styles.adminContainer}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="#F3F4F6" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Gerenciar conteúdos" titleStyle={styles.titleLight} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.adminContent}>
      
      <Text variant="headlineSmall" style={styles.adminTitle}>
        Gerenciar conteúdos
      </Text>
      
      <Text style={styles.adminDescription}>
        Cadastre uma nova série ou imagem para exibição pública.
      </Text>

      {status ? (
        <Text style={status.type === 'success' ? styles.successText : styles.errorText}>
          {status.message}
        </Text>
      ) : null}

      <Text style={styles.categoryLabel}>Tipo de conteúdo</Text>
      <SegmentedButtons
        value={form.category}
        onValueChange={(value) => update('category', value)}
        buttons={[
          { value: 'Séries', label: 'Série' },
          { value: 'Filmes', label: 'Filme' },
        ]}
        style={styles.categorySelector}
        theme={{ colors: { secondaryContainer: '#8B5CF6', onSecondaryContainer: '#FFFFFF', outline: '#6B7280' } }}
      />
      
      <TextInput 
        label="Título" 
        mode="outlined" 
        value={form.title} 
        onChangeText={(value) => update('title', value)} 
        textColor="#F3F4F6"
        activeOutlineColor="#8B5CF6"
        outlineColor="#2C2C2C"
        theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
        style={styles.input} 
      />
      
      <TextInput 
        label="Subtítulo" 
        mode="outlined" 
        value={form.subtitle} 
        onChangeText={(value) => update('subtitle', value)} 
        textColor="#F3F4F6"
        activeOutlineColor="#8B5CF6"
        outlineColor="#2C2C2C"
        theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
        style={styles.input} 
      />
      
      <Button mode="outlined" icon="image-plus" onPress={chooseImage} loading={uploading} disabled={uploading} textColor="#F3F4F6" style={styles.adminCancelButton}>
        {form.imageUrl ? 'Trocar imagem' : 'Escolher imagem'}
      </Button>
      {form.imageUrl ? <Text style={styles.imageSelectedText}>Imagem selecionada.</Text> : null}
      
      <TextInput 
        label="Descrição" 
        mode="outlined" 
        value={form.description} 
        onChangeText={(value) => update('description', value)} 
        multiline 
        textColor="#F3F4F6"
        activeOutlineColor="#8B5CF6"
        outlineColor="#2C2C2C"
        theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
        style={styles.input} 
      />
      
      <Button 
        mode="contained" 
        icon="plus" 
        onPress={save} 
        disabled={!form.title || !form.subtitle || !form.imageUrl || !form.category}
        buttonColor="#8B5CF6"
        textColor="#FFFFFF"
        style={{ marginTop: 10, borderRadius: 12 }} // Arredondamento acompanhando os outros botões do App
      >
        Cadastrar conteúdo
      </Button>

      <Button
        mode="outlined"
        icon="close"
        onPress={cancel}
        textColor="#F3F4F6"
        style={styles.adminCancelButton}
      >
        Cancelar
      </Button>
      </ScrollView>
    </View>
  );
}