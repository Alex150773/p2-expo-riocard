import { AppColors } from '@/constants/theme';
import { CARTOES_DEMO } from '@/data/cartoes';
import { useCartoes } from '@/hooks/use-cartoes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ValidaMaisScreen() {
  const { cartoes } = useCartoes();
  const cartoesDisponiveis = cartoes.length > 0 ? cartoes : [...CARTOES_DEMO];
  const [cartaoId, setCartaoId] = useState(cartoesDisponiveis[0].id);

  const cartaoSelecionado =
    cartoesDisponiveis.find((item) => item.id === cartaoId) ?? cartoesDisponiveis[0];

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
            Aviso acadêmico: esta funcionalidade realiza apenas uma simulação local de interface e não interage com catracas, validadores ou sistemas oficiais.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>1. Selecione o cartão</Text>

        <View style={styles.selectorList}>
          {cartoesDisponiveis.map((cartao) => {
            const ativo = cartao.id === cartaoSelecionado.id;
            return (
              <TouchableOpacity
                key={cartao.id}
                style={[styles.cardOption, ativo && styles.cardOptionActive]}
                activeOpacity={0.8}
                onPress={() => setCartaoId(cartao.id)}
              >
                <View style={styles.cardOptionLeft}>
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={24}
                    color={ativo ? '#fff' : AppColors.azul}
                  />
                  <View style={styles.cardOptionInfo}>
                    <Text style={[styles.cardOptionName, ativo && styles.textWhite]}>
                      {cartao.nome}
                    </Text>
                    <Text style={[styles.cardOptionNumber, ativo && styles.textWhiteSub]}>
                      Número: {cartao.numero}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.cardOptionBalance, ativo && styles.textWhite]}>
                  {moeda(cartao.saldoDemonstrativo)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.selectedSummary}>
          <Text style={styles.summaryLabel}>Cartão pronto para conferência demonstrativa</Text>
          <Text style={styles.summaryTitle}>
            {cartaoSelecionado.nome} • {cartaoSelecionado.numero}
          </Text>
          <Text style={styles.summaryBalance}>
            Saldo demonstrativo atual: {moeda(cartaoSelecionado.saldoDemonstrativo)}
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
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 12 },
  selectorList: { gap: 10, marginBottom: 18 },
  cardOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardOptionActive: {
    backgroundColor: AppColors.azul,
    borderColor: AppColors.azul,
  },
  cardOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardOptionInfo: { flex: 1 },
  cardOptionName: { fontSize: 16, fontWeight: '700', color: '#333' },
  cardOptionNumber: { fontSize: 13, color: '#666', marginTop: 2 },
  cardOptionBalance: { fontSize: 15, fontWeight: '700', color: AppColors.azul },
  textWhite: { color: '#fff' },
  textWhiteSub: { color: 'rgba(255,255,255,0.85)' },
  selectedSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dce6f2',
    padding: 16,
    gap: 4,
  },
  summaryLabel: { fontSize: 12, color: '#666' },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  summaryBalance: { fontSize: 14, color: AppColors.azul, fontWeight: '600', marginTop: 2 },
});