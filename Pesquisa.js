import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text, TextInput } from 'react-native-paper';
import { styles } from './css/Styles';
import { useContents } from './context/ContentContext';

export default function Pesquisa({ navigation }) {
  const { contents, loadContents, loading } = useContents();
  const [term, setTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      loadContents(term).catch((requestError) => {
        setError(requestError.message || 'Não foi possível realizar a pesquisa.');
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [term]);

  return <View style={styles.home}>
    <Appbar.Header style={styles.header}><Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} /><Appbar.Content title="Pesquisa" titleStyle={styles.titleLight} /></Appbar.Header>
    <TextInput
      label="Pesquisar conteúdos"
      placeholder="Digite um título ou subtítulo"
      mode="outlined"
      value={term}
      onChangeText={(value) => { setError(''); setTerm(value); }}
      textColor="#F3F4F6"
      placeholderTextColor="#9CA3AF"
      cursorColor="#8B5CF6"
      selectionColor="#8B5CF6"
      activeOutlineColor="#8B5CF6"
      outlineColor="#6B7280"
      theme={{ colors: { onSurface: '#F3F4F6', onSurfaceVariant: '#D1D5DB', background: '#1E1E1E' } }}
      style={styles.searchInput}
    />
    <ScrollView contentContainerStyle={styles.cardsContent}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? <Text style={styles.emptyText}>Buscando...</Text> : null}
      {!loading && !error && !contents.length ? <Text style={styles.emptyText}>Nenhum conteúdo encontrado.</Text> : null}
      {!loading && contents.map((item) => (
        <Card key={item._id} style={styles.card}>
          <Card.Title title={item.title} subtitle={item.subtitle} titleStyle={styles.cardTitle} subtitleStyle={styles.cardSubtitle} />
          <Card.Cover source={{ uri: item.imageUrl }} />
        </Card>
      ))}
    </ScrollView>
  </View>;
}
