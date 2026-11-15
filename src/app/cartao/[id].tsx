import { AppColors } from '@/constants/theme';
import { useState } from 'react';
import { CARTOES_DEMO } from '@/data/cartoes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalhesCartaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cartao = CARTOES_DEMO.find((item) => item.id === id);
  const [saldoVisivel, setSaldoVisivel] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do cartão</Text>
        <View style={{ width: 28 }} />
      </View>

      {!cartao ? (
        <View style={styles.empty}>
          <Text style={styles.title}>Cartão não encontrado</Text>
          <Text style={styles.secondary}>O cartão selecionado não está disponível.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/cartoes')}>
            <Text style={styles.buttonText}>Voltar aos meus cartões</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.cardPreview, { backgroundColor: cartao.cor }]}>
            <MaterialCommunityIcons name="credit-card-outline" size={42} color="#fff" />
            <Text style={styles.previewName}>{cartao.nome}</Text>
            <Text style={styles.previewNumber}>{cartao.numero}</Text>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>Saldo demonstrativo</Text>
                <Text style={styles.balanceValue}>
                  {saldoVisivel ? cartao.saldoDemonstrativo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ • • • • •'}
                </Text>
              </View>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={saldoVisivel ? 'Ocultar saldo' : 'Mostrar saldo'} onPress={() => setSaldoVisivel((atual) => !atual)}>
                <Ionicons name={saldoVisivel ? 'eye-outline' : 'eye-off-outline'} size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.title}>Informações do cartão</Text>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{cartao.nome}</Text>
            <View style={styles.divider} />
            <Text style={styles.label}>Número</Text>
            <Text style={styles.value}>{cartao.numero}</Text>
            <View style={styles.divider} />
            <Text style={styles.label}>Bilhete Único Intermunicipal (BUI)</Text>
            <Text style={[styles.value, { color: cartao.buiHabilitado ? '#278020' : '#666' }]}>
              {cartao.buiHabilitado ? 'Habilitado' : 'Não habilitado'}
            </Text>
          </View>

          <Text style={styles.notice}>Dados fictícios utilizados apenas para demonstração acadêmica.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/recarga')}>
            <MaterialCommunityIcons name="cash-plus" size={22} color="#fff" />
            <Text style={styles.buttonText}>Ir para recarga</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.historyButton]}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/historico-recargas', params: { cartaoId: cartao.id } })}
          >
            <Ionicons name="time-outline" size={22} color={AppColors.azul} />
            <Text style={[styles.buttonText, styles.historyButtonText]}>Histórico deste cartão</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9faf7' },
  header: { height: 95, backgroundColor: AppColors.azul, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitle: { fontSize: 21, color: '#fff', fontWeight: '700' },
  content: { padding: 18, paddingBottom: 40 },
  cardPreview: { minHeight: 185, borderRadius: 12, padding: 22, justifyContent: 'space-between', marginBottom: 28 },
  previewName: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 16 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  balanceLabel: { color: '#fff', fontSize: 12 },
  balanceValue: { color: '#fff', fontSize: 23, fontWeight: '700', marginTop: 5 },
  previewNumber: { color: '#fff', fontSize: 18, marginTop: 5 },
  title: { color: AppColors.azul, fontSize: 24, fontWeight: '700', marginBottom: 16 },
  infoBox: { backgroundColor: '#fff', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#e7e7e7' },
  label: { color: '#777', fontSize: 14, marginBottom: 5 },
  value: { color: '#222', fontSize: 18, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 17 },
  notice: { color: '#666', fontSize: 13, marginVertical: 22, lineHeight: 19 },
  button: { minHeight: 54, backgroundColor: AppColors.azul, borderRadius: 9, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 15 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  historyButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: AppColors.azul, marginTop: 12 },
  historyButtonText: { color: AppColors.azul },
  empty: { flex: 1, padding: 24, justifyContent: 'center' },
  secondary: { color: '#666', marginBottom: 24 },
});
