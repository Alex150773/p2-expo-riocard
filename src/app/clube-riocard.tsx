import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClubeRiocardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Voltar" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clube Riocard</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noticeBanner}>
          <Ionicons name="information-circle-outline" size={22} color={AppColors.azul} />
          <Text style={styles.noticeText}>
            Demonstração acadêmica: os benefícios exibidos nesta seção são exclusivamente ilustrativos e não representam parcerias comerciais ou ofertas reais.
          </Text>
        </View>

        <View style={styles.placeholderCard}>
          <Ionicons name="star-outline" size={34} color={AppColors.azul} />
          <Text style={styles.placeholderTitle}>Clube Riocard demonstrativo</Text>
          <Text style={styles.placeholderText}>
            A lista de benefícios fictícios será adicionada na próxima etapa.
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