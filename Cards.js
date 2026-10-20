import React from 'react';
import { Text } from 'react-native'; // Adicionado para estilizar a descrição
import { Card, Button } from 'react-native-paper';
import { styles } from './css/Styles';

export default function ModCard({ content, canManage, onEdit, onDelete }) {
  return (
    <Card style={styles.card}>
      <Card.Title 
        title={content.title} 
        subtitle={content.subtitle} 
        titleStyle={styles.cardTitle} 
        subtitleStyle={styles.cardSubtitle} // Adicionado para o subtítulo ficar legível
      />
      <Card.Cover style={styles.cardCover} source={{ uri: content.imageUrl }} />
      
      {content.description ? (
        <Card.Content>
          <Text style={styles.cardText}>{content.description}</Text>
        </Card.Content>
      ) : null}
      
      <Card.Actions style={styles.cardActions}>
        {canManage ? (
          <>
            <Button 
              icon="pencil" 
              textColor="#8B5CF6" // Roxo do nosso tema
              onPress={() => onEdit(content)}
            >
              Editar imagem
            </Button>
            <Button 
              icon="delete" 
              textColor="#EF4444" // Vermelho mais claro e suave, ideal para Dark Mode
              onPress={() => onDelete(content)}
            >
              Excluir
            </Button>
          </>
        ) : null}
      </Card.Actions>
    </Card>
  );
}