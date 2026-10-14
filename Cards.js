import React from 'react';
import { Card, Button } from 'react-native-paper';
import { styles } from './css/Styles';

export default function ModCard({ content, canManage, onEdit, onDelete }) {
  return <Card style={styles.card}>
    <Card.Title title={content.title} subtitle={content.subtitle} titleStyle={styles.cardTitle} />
    <Card.Cover style={styles.cardCover} source={{ uri: content.imageUrl }} />
    {content.description ? <Card.Content>{content.description}</Card.Content> : null}
    <Card.Actions style={styles.cardActions}>
      {canManage ? <><Button icon="pencil" onPress={() => onEdit(content)}>Editar imagem</Button><Button icon="delete" textColor="#B00020" onPress={() => onDelete(content)}>Excluir</Button></> : null}
    </Card.Actions>
  </Card>;
}
