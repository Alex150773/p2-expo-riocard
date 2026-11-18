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

function mascararNumero(numero: string): string {
  const limpo = numero.replace(/\s+/g, '');
  if (limpo.length <= 4) return `•••• ${limpo}`;
  return `•••• •••• ${limpo.slice(-4)}`;
}

export default function CartaoDigitalScreen() {
  const { cartoes } = useCartoes();
  const cartoesDisponiveis = cartoes.length > 0 ? cartoes : [...CARTOES_DEMO];
  const [cartaoId, setCartaoId] = useState(cartoesDisponiveis[0].id);
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  const cartaoSelecionado =
    cartoesDisponiveis.find((item) => item.id === cartaoId) ?? cartoesDisponiveis[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Voltar" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cartão Digital</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Alternar cartão</Text>
        <View style={styles.selectorRow}>
          {cartoesDisponiveis.map((cartao) => {
            const ativo = cartao.id === cartaoSelecionado.id;
            return (
              <TouchableOpacity
                key={cartao.id}
                style={[styles.chip, ativo && styles.chipActive]}
                onPress={() => setCartaoId(cartao.id)}
              >
                <Text style={[styles.chipText, ativo && styles.chipTextActive]}>
                  {cartao.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.cardVisual}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardBrand}>riocard mais++</Text>
              <Text style={styles.cardName}>{cartaoSelecionado.nome}</Text>
            </View>
            <MaterialCommunityIcons name="contactless-payment" size={30} color="#fff" />
          </View>

          <Text style={styles.cardNumber}>{mascararNumero(cartaoSelecionado.numero)}</Text>

          <View style={styles.balanceSection}>
            <View>
              <Text style={styles.balanceLabel}>Saldo demonstrativo</Text>
              <Text style={styles.balanceValue}>
                {saldoVisivel ? moeda(cartaoSelecionado.saldoDemonstrativo) : 'R$ • • • • •'}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityLabel={saldoVisivel ? 'Ocultar saldo' : 'Mostrar saldo'}
              onPress={() => setSaldoVisivel((atual) => !atual)}
              hitSlop={10}
            >
              <Ionicons
                name={saldoVisivel ? 'eye-outline' : 'eye-off-outline'}
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informações do cartão selecionado</Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Modalidade: </Text>
            {cartaoSelecionado.nome}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Identificação mascarada: </Text>
            {mascararNumero(cartaoSelecionado.numero)}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status: </Text>
            Ativo para demonstração acadêmica
          </Text>
        </View>

        <View style={styles.noticeBanner}>
          <Ionicons name="information-circle-outline" size={22} color={AppColors.azul} />
          <Text style={styles.noticeText}>
            Aviso acadêmico: este cartão digital é meramente ilustrativo e não gera QR Code ou credencial válida para embarque, catracas ou pagamentos reais.
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
  sectionLabel: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 10 },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: {
    borderColor: AppColors.azul,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: AppColors.azul },
  chipText: { color: AppColors.azul, fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  cardVisual: {
    backgroundColor: AppColors.azul,
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardBrand: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' },
  cardName: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    fontWeight: '600',
    marginTop: 24,
  },
  balanceSection: {
    marginTop: 22,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  balanceValue: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 2 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 2 },
  infoRow: { fontSize: 14, color: '#444', lineHeight: 20 },
  infoLabel: { fontWeight: '700', color: '#222' },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#eef4fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cfe0f5',
    padding: 14,
  },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 19, color: '#2b4c73' },
});