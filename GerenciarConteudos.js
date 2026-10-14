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

  return <ScrollView style={styles.adminContainer} contentContainerStyle={styles.adminContent}>
    <Text variant="headlineSmall" style={styles.adminTitle}>Gerenciar conteúdos</Text>
    <Text style={styles.adminDescription}>Cadastre uma nova série ou imagem para exibição pública.</Text>
    <TextInput label="Título" mode="outlined" value={form.title} onChangeText={(value) => update('title', value)} style={styles.input} />
    <TextInput label="Subtítulo" mode="outlined" value={form.subtitle} onChangeText={(value) => update('subtitle', value)} style={styles.input} />
    <TextInput label="URL da imagem" mode="outlined" value={form.imageUrl} onChangeText={(value) => update('imageUrl', value)} style={styles.input} autoCapitalize="none" />
    <TextInput label="Descrição" mode="outlined" value={form.description} onChangeText={(value) => update('description', value)} style={styles.input} multiline />
    <Button mode="contained" icon="plus" onPress={save} disabled={!form.title || !form.subtitle || !form.imageUrl}>Cadastrar conteúdo</Button>
  </ScrollView>;
}
