import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Appbar, Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { useContents } from './context/ContentContext';

export default function AppBar({ navigation }) {
  const { contents, loading, canManage, updateContent, deleteContent } = useContents();
  const [editing, setEditing] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTab, setSelectedTab] = useState('Séries');

  const tabs = ['Séries', 'Tecnologia', 'Lançamentos', 'Favoritos'];
  const visibleContents = selectedTab === 'Favoritos'
    ? []
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
  const remove = (content) => Alert.alert('Excluir conteúdo', `Excluir "${content.title}"?`, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: () => deleteContent(content._id).catch((error) => Alert.alert('Erro', error.message)) },
  ]);

  return <View style={styles.home}>
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" iconColor="white" onPress={() => navigation.openDrawer()} />
      <Appbar.Content title="Technologic" titleStyle={styles.titleLight} />
      <Appbar.Action icon="magnify" iconColor="white" onPress={() => navigation.navigate('Pesquisa')} />
      <Appbar.Action icon={canManage ? 'account-check' : 'account'} iconColor="white" onPress={() => navigation.navigate(canManage ? 'Perfil' : 'Acesso')} />
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
      {visibleContents.map((content) => <ModCard key={content._id} content={content} canManage={canManage} onEdit={edit} onDelete={remove} />)}
    </ScrollView>
    <Portal>
      <Dialog visible={!!editing} onDismiss={() => setEditing(null)}>
        <Dialog.Title>Editar imagem</Dialog.Title>
        <Dialog.Content><TextInput label="URL da imagem" mode="outlined" value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" /></Dialog.Content>
        <Dialog.Actions><Button onPress={() => setEditing(null)}>Cancelar</Button><Button onPress={saveImage}>Salvar</Button></Dialog.Actions>
      </Dialog>
    </Portal>
  </View>;
}
