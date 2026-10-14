import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text, TextInput } from 'react-native-paper';
import { styles } from './css/Styles';
import { useContents } from './context/ContentContext';

export default function Pesquisa({ navigation }) {
  const { contents, loadContents, loading } = useContents();
  const [term, setTerm] = useState('');
  return <View style={styles.home}>
    <Appbar.Header style={styles.header}><Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} /><Appbar.Content title="Pesquisa" titleStyle={styles.titleLight} /></Appbar.Header>
    <TextInput label="Pesquisar conteúdos" placeholder="Digite um título ou subtítulo" mode="outlined" value={term} onChangeText={(value) => { setTerm(value); loadContents(value); }} style={styles.searchInput} />
    <ScrollView contentContainerStyle={styles.cardsContent}>
      {loading ? <Text>Buscando...</Text> : contents.map((item) => <Card key={item._id} style={styles.card}><Card.Title title={item.title} subtitle={item.subtitle} /><Card.Cover source={{ uri: item.imageUrl }} /></Card>)}
    </ScrollView>
  </View>;
}
