import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212', // Fundo principal escuro
    },

    logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
        backgroundColor: '#1E1E1E', // Fundo de fallback mais escuro
        borderRadius: 150,
        borderWidth: 3,
        borderColor: '#2C2C2C', // Borda discreta
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#F3F4F6', // Quase branco para leitura confortável
        letterSpacing: 0.5,
    },

    subtitle: {
        marginTop: 10,
        fontSize: 16,
        color: '#9CA3AF', // Cinza médio para textos secundários
    },
    
    header: {
        backgroundColor: '#1E1E1E', // Cabeçalho combinando com os cards
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    
    titleLight: {
        color: '#F3F4F6',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    
    home: {
        flex: 1,
        backgroundColor: '#121212',
    },
    
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#6B7280',
        fontStyle: 'italic',
    },

    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#F87171',
    },

    successText: {
        textAlign: 'center',
        marginBottom: 15,
        color: '#86EFAC',
        fontWeight: '600',
    },
    
    searchInput: {
        margin: 20,
        backgroundColor: '#1E1E1E', // Input escuro
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2C2C2C',
        color: '#F3F4F6', // Cor do texto digitado
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    
    adminContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    
    adminContent: {
        padding: 24,
    },
    
    adminTitle: {
        fontWeight: '800',
        marginBottom: 8,
        color: '#F3F4F6',
        fontSize: 22,
    },
    
    adminDescription: {
        marginBottom: 20,
        color: '#9CA3AF',
        lineHeight: 22,
    },

    categoryLabel: {
        color: '#F3F4F6',
        fontWeight: '600',
        marginBottom: 8,
    },

    categorySelector: {
        marginBottom: 16,
    },

    adminCancelButton: {
        marginTop: 10,
        borderColor: '#6B7280',
        borderRadius: 12,
    },

    imageSelectedText: {
        color: '#86EFAC',
        marginBottom: 10,
        marginTop: -8,
    },
    
    tabs: {
        height: 100,
        flexGrow: 0,
    },
    
    tab: {
        height: 45,
        paddingHorizontal: 20,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2A2A2A', // Cinza intermediário para aba inativa
        borderRadius: 25,
        marginTop: 10,
    },
    
    tabText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '600',
    },
    
    activeTab: {
        backgroundColor: '#8B5CF6', // Roxo vibrante para destaque
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    
    activeTabText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    
// ========= CARD  ================
   
    cards: {
        flex: 1,
    },

    cardsContent: {
        paddingHorizontal: 10,
        paddingTop: 0,
        paddingBottom: 30,
    },

    card: {
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: 12,
        borderRadius: 16,
        backgroundColor: '#1E1E1E', // Fundo do card em destaque sobre o fundo principal
        borderWidth: 1,
        borderColor: '#2C2C2C', // Contorno leve para separar do fundo
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    
// ========= ACESSO  ================
  
   acesso: {
        padding: 25,
        justifyContent: 'center',
    },
    
    acessoTitulo: {
        textAlign: 'center',
        fontWeight: '800',  
        marginBottom: 10,
        color: '#F3F4F6',
        fontSize: 24,
    },
    
    acessoTexto: {
        textAlign: 'center',
        marginBottom: 30,
        color: '#9CA3AF',
        lineHeight: 22,
    },
    
    acessoButton: {
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#8B5CF6',
    },

// ========= LOGIN   ================

    loginContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },

    loginContent: {
        padding: 25,
    },

    loginTitulo: {
        textAlign: 'center',
        fontWeight: '800',
        marginTop: 30,
        color: '#F3F4F6',
        fontSize: 24,
    },

    loginTexto: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 30,
        color: '#9CA3AF',
    },

    input: {
        marginBottom: 15,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2C2C2C',
        color: '#F3F4F6', // Garante que o texto digitado ficará visível
    },

    loginButton: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#8B5CF6',
    },
    
// =========================
// CADASTRO
// =========================

    cadastroContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },

    cadastroContent: {
        padding: 25,
    },

    cadastroTitulo: {
        textAlign: 'center',
        fontWeight: '800',
        marginTop: 20,
        color: '#F3F4F6',
        fontSize: 24,
    },

    cadastroTexto: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 25,
        color: '#9CA3AF',
    },

    cadastroButton: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#8B5CF6',
    },
    
// ========= CABEÇALHO DO MENU ================

    menuHeader: {
        padding: 20,
        backgroundColor: '#1E1E1E',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2C',
    },

    // ========= ESTILOS DO MODCARD ================

    cardTitle: {
        color: '#F3F4F6', // Texto claro
        fontWeight: 'bold',
        fontSize: 18,
    },
    
    cardSubtitle: {
        color: '#9CA3AF', // Cinza médio
        fontSize: 14,
    },
    
    cardText: {
        color: '#9CA3AF',
        marginTop: 10,
        lineHeight: 20, // Melhora a leitura da descrição
    },
    
    cardCover: {
        // O react-native-paper já arredonda o topo, 
        // zeramos as de baixo caso a imagem não fique colada no rodapé
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0,
    },
    
    cardActions: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        justifyContent: 'flex-end', // Alinha os botões à direita
    },
});