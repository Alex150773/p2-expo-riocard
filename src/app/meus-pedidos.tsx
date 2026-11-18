import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MeusPedidosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Voltar" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus pedidos</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Acompanhe os pedidos de recarga demonstrativos registrados no aplicativo. Nenhuma cobrança ou transação financeira real é efetuada.
        </Text>

        <View style={styles.placeholderCard}>
          <Ionicons name="clipboard-text-outline" size={34} color={AppColors.azul} />
          <Text style={styles.placeholderTitle}>Área de pedidos pronta</Text>
          <Text style={styles.placeholderText}>
            Os registros de recargas serão carregados nesta tela na próxima etapa.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9faf7' },
  header: {
    height: 95,
    backgroundColor: AppColors.azul,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSpacer: { width: 28 },
  content: { padding: 18, paddingBottom: 35 },
  description: { fontSize: 15, lineHeight: 22, color: '#555', marginBottom: 18 },
  placeholderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  placeholderTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  placeholderText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
});