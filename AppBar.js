import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Appbar, Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { useContents } from './context/ContentContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from './context/AuthContext';

export default function AppBar({ navigation }) {
  const { contents, loading, canManage, updateContent, deleteContent, toggleFavorite } = useContents();
  const [editing, setEditing] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Séries');

  const tabs = ['Séries', 'Filmes', 'Todos', 'Favoritos'];
  const visibleContents = selectedTab === 'Todos'
    ? contents
    : selectedTab === 'Favoritos'
      ? contents.filter((content) => content.isFavorite)
      : contents.filter((content) => (content.category || 'Séries') === selectedTab);

  const edit = (content) => {
    setEditing(content);
    setImageUrl(content.imageUrl);
  };

  const saveImage = async () => {
    try {
      await updateContent(editing._id, { imageUrl });
      setEditing(null);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const chooseReplacementImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true });
    if (result.canceled) return;
    setUploading(true);
    try {
      setImageUrl(await uploadImage(result.assets[0]));
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = (content) => Alert.alert('Excluir conteúdo', `Excluir "${content.title}"?`, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: () => deleteContent(content._id).catch((error) => Alert.alert('Erro', error.message)) },
  ]);

  const favorite = async (content) => {
    if (!canManage) {
      Alert.alert('Login necessário', 'Entre na sua conta para adicionar favoritos.');
      return;
    }
    try {
      await toggleFavorite(content._id);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.home}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" iconColor="#F3F4F6" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Technologic" titleStyle={styles.titleLight} />
        <Appbar.Action icon="magnify" iconColor="#F3F4F6" onPress={() => navigation.navigate('Pesquisa')} />
        <Appbar.Action icon={canManage ? 'account-check' : 'account'} iconColor="#F3F4F6" onPress={() => navigation.navigate(canManage ? 'Perfil' : 'Acesso')} />
      </Appbar.Header>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedTab === tab }}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.cards} contentContainerStyle={styles.cardsContent}>
        {loading ? <Text style={styles.emptyText}>Carregando conteúdos...</Text> : null}
        {!loading && !visibleContents.length ? <Text style={styles.emptyText}>Nenhum conteúdo encontrado nesta categoria.</Text> : null}
        {visibleContents.map((content) => <ModCard key={content._id} content={content} canManage={canManage} onEdit={edit} onDelete={remove} onFavorite={() => favorite(content)} />)}
      </ScrollView>

      <Portal>
        <Dialog visible={!!editing} onDismiss={() => setEditing(null)} style={{ backgroundColor: '#1E1E1E' }}>
          <Dialog.Title style={{ color: '#F3F4F6' }}>Editar imagem</Dialog.Title>
          <Dialog.Content>
            <Button icon="image-plus" textColor="#8B5CF6" onPress={chooseReplacementImage} loading={uploading} disabled={uploading}>Escolher arquivo</Button>
            <TextInput 
              label="URL da imagem" 
              mode="outlined" 
              value={imageUrl} 
              onChangeText={setImageUrl} 
              autoCapitalize="none"
              textColor="#F3F4F6"
              activeOutlineColor="#8B5CF6"
              outlineColor="#2C2C2C"
              style={{ backgroundColor: '#1E1E1E' }}
              theme={{ colors: { onSurfaceVariant: '#9CA3AF' } }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor="#9CA3AF" onPress={() => setEditing(null)}>Cancelar</Button>
            <Button textColor="#8B5CF6" onPress={saveImage} disabled={uploading}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}