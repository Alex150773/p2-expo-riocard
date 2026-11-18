import { AppColors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ValidaMaisScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Voltar" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Valida Mais</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noticeBanner}>
          <Ionicons name="shield-checkmark-outline" size={22} color={AppColors.azul} />
          <Text style={styles.noticeText}>
            Aviso acadêmico: esta funcionalidade realiza apenas uma simulação local de interface e não se comunica com validadores de ônibus, barcas, trens, metrô ou sistemas oficiais de bilhetagem.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="cellphone-check" size={38} color={AppColors.azul} />
          <Text style={styles.infoTitle}>Como funciona o Valida Mais demonstrativo</Text>
          <Text style={styles.infoText}>
            Nas próximas etapas, você poderá selecionar um cartão já cadastrado no aplicativo e executar uma simulação local de conferência de recarga/crédito, recebendo um retorno visual imediato.
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
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#eef4fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cfe0f5',
    padding: 14,
    marginBottom: 18,
  },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 19, color: '#2b4c73' },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  infoTitle: { fontSize: 17, fontWeight: '700', color: '#333', textAlign: 'center' },
  infoText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 21 },
});