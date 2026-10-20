import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useContents } from './context/ContentContext';
import { styles } from './css/Styles';

export default function GerenciarConteudos() {
  const { createContent } = useContents();
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', description: '' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async () => {
    try {
      await createContent(form);
      setForm({ title: '', subtitle: '', imageUrl: '', description: '' });
      Alert.alert('Sucesso', 'Conteúdo cadastrado.');
    } catch (error) {
      Alert.alert('Não foi possível cadastrar', error.message);
    }
  };

  return (
    <ScrollView style={styles.adminContainer} contentContainerStyle={styles.adminContent}>
      
      <Text variant="headlineSmall" style={styles.adminTitle}>
        Gerenciar conteúdos
      </Text>
      
      <Text style={styles.adminDescription}>
        Cadastre uma nova série ou imagem para exibição pública.
      </Text>
      
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
      
      <TextInput 
        label="URL da imagem" 
        mode="outlined" 
        value={form.imageUrl} 
        onChangeText={(value) => update('imageUrl', value)} 
        autoCapitalize="none" 
        textColor="#F3F4F6"
        activeOutlineColor="#8B5CF6"
        outlineColor="#2C2C2C"
        theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
        style={styles.input} 
      />
      
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
        disabled={!form.title || !form.subtitle || !form.imageUrl}
        buttonColor="#8B5CF6"
        textColor="#FFFFFF"
        style={{ marginTop: 10, borderRadius: 12 }} // Arredondamento acompanhando os outros botões do App
      >
        Cadastrar conteúdo
      </Button>
      
    </ScrollView>
  );
}