import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type BeneficioDemo = {
  id: string;
  titulo: string;
  categoria: string;
  resumo: string;
  regras: string;
  validade: string;
};

const BENEFICIOS_DEMO: BeneficioDemo[] = [
  {
    id: 'ben-01',
    titulo: 'Café Cultural Centro (Exemplo)',
    categoria: 'Alimentação • Fictício',
    resumo: 'Desconto ilustrativo de 15% em bebidas quentes para apresentação do cartão demonstrativo.',
    regras: 'Benefício fictício criado apenas para simular a exibição de vantagens no aplicativo acadêmico.',
    validade: 'Exemplo permanente de demonstração',
  },
  {
    id: 'ben-02',
    titulo: 'Livraria Estação Leitura (Exemplo)',
    categoria: 'Cultura e Educação • Fictício',
    resumo: 'Vale-leitura ilustrativo de R$ 10,00 em compras acima de R$ 60,00.',
    regras: 'Não possui vínculo comercial real. Utilizado exclusivamente para testes de interface na disciplina.',
    validade: 'Exemplo permanente de demonstração',
  },
  {
    id: 'ben-03',
    titulo: 'Cinema Bairro Modelo (Exemplo)',
    categoria: 'Lazer • Fictício',
    resumo: 'Meia-entrada demonstrativa em sessões de segunda a quarta-feira.',
    regras: 'Oferta simulada sem integração com bilheterias ou estabelecimentos externos.',
    validade: 'Exemplo permanente de demonstração',
  },
  {
    id: 'ben-04',
    titulo: 'Bicicletário Integrado Demo (Exemplo)',
    categoria: 'Mobilidade • Fictício',
    resumo: 'Primeira hora gratuita ilustrativa em bicicletários próximos a terminais.',
    regras: 'Recurso conceitual apresentado apenas para fins de avaliação do projeto P2.',
    validade: 'Exemplo permanente de demonstração',
  },
];

export default function ClubeRiocardScreen() {
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

  function alternarBeneficio(id: string) {
    setSelecionadoId((atual) => (atual === id ? null : id));
  }

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
            Demonstração acadêmica: todos os benefícios abaixo são fictícios e não representam parcerias comerciais ou ofertas reais. Toque em um item para consultar os detalhes.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Benefícios demonstrativos ({BENEFICIOS_DEMO.length})</Text>

        {BENEFICIOS_DEMO.map((beneficio) => {
          const aberto = selecionadoId === beneficio.id;

          return (
            <TouchableOpacity
              key={beneficio.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => alternarBeneficio(beneficio.id)}
            >
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{beneficio.categoria}</Text>
              </View>
              <Text style={styles.cardTitle}>{beneficio.titulo}</Text>
              <Text style={styles.cardSummary}>{beneficio.resumo}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.footerLink}>
                  {aberto ? 'Ocultar detalhes' : 'Consultar detalhes'}
                </Text>
                <Ionicons
                  name={aberto ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={AppColors.azul}
                />
              </View>

              {aberto ? (
                <View style={styles.detailsBox}>
                  <Text style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Condições ilustrativas: </Text>
                    {beneficio.regras}
                  </Text>
                  <Text style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vigência: </Text>
                    {beneficio.validade}
                  </Text>
                  <Text style={styles.detailNote}>
                    Aviso: nenhum cupom válido ou resgate comercial externo é gerado por esta tela.
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef2f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: AppColors.azul },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginTop: 2 },
  cardSummary: { fontSize: 14, lineHeight: 20, color: '#555' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerLink: { fontSize: 13, fontWeight: '600', color: AppColors.azul },
  detailsBox: {
    marginTop: 6,
    backgroundColor: '#f5f8fc',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  detailRow: { fontSize: 13, lineHeight: 19, color: '#444' },
  detailLabel: { fontWeight: '700', color: '#222' },
  detailNote: { fontSize: 12, color: '#666', fontStyle: 'italic', marginTop: 2 },
});