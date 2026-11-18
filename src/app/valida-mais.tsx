import { AppColors } from '@/constants/theme';
import { CARTOES_DEMO } from '@/data/cartoes';
import { useCartoes } from '@/hooks/use-cartoes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type ResultadoSimulacao = {
  cartaoNome: string;
  cartaoNumero: string;
  saldo: number;
  horario: string;
};

export default function ValidaMaisScreen() {
  const { cartoes } = useCartoes();
  const cartoesDisponiveis = cartoes.length > 0 ? cartoes : [...CARTOES_DEMO];
  const [cartaoId, setCartaoId] = useState(cartoesDisponiveis[0].id);
  const [simulando, setSimulando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);

  const cartaoSelecionado =
    cartoesDisponiveis.find((item) => item.id === cartaoId) ?? cartoesDisponiveis[0];

  function selecionarCartao(id: string) {
    setCartaoId(id);
    setResultado(null);
  }

  function executarSimulacao() {
    setSimulando(true);
    setResultado(null);

    setTimeout(() => {
      setResultado({
        cartaoNome: cartaoSelecionado.nome,
        cartaoNumero: cartaoSelecionado.numero,
        saldo: cartaoSelecionado.saldoDemonstrativo,
        horario: new Date().toLocaleTimeString('pt-BR'),
      });
      setSimulando(false);
    }, 650);
  }

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
            Aviso acadêmico: esta funcionalidade realiza apenas uma simulação local no aplicativo e não interage com catracas, validadores de transporte nem sistemas oficiais.
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
                disabled={simulando}
                onPress={() => selecionarCartao(cartao.id)}
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

        <Text style={styles.sectionTitle}>2. Simulação local</Text>

        <TouchableOpacity
          style={[styles.actionButton, simulando && styles.actionButtonDisabled]}
          activeOpacity={0.85}
          disabled={simulando}
          onPress={executarSimulacao}
        >
          {simulando ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.actionButtonText}>Simulando leitura local...</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="cellphone-check" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>
                {resultado ? 'Repetir simulação' : 'Simular validação local'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {resultado ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="checkmark-circle" size={26} color="#278020" />
              <Text style={styles.resultTitle}>Simulação concluída no aparelho</Text>
            </View>

            <Text style={styles.resultRow}>
              <Text style={styles.resultLabel}>Cartão conferido: </Text>
              {resultado.cartaoNome} ({resultado.cartaoNumero})
            </Text>
            <Text style={styles.resultRow}>
              <Text style={styles.resultLabel}>Saldo demonstrativo exibido: </Text>
              {moeda(resultado.saldo)}
            </Text>
            <Text style={styles.resultRow}>
              <Text style={styles.resultLabel}>Horário do teste local: </Text>
              {resultado.horario}
            </Text>
            <Text style={styles.resultDisclaimer}>
              Resultado meramente ilustrativo gerado localmente. Nenhuma validação real em catraca ou sistema oficial foi executada.
            </Text>
          </View>
        ) : null}
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
  selectorList: { gap: 10, marginBottom: 20 },
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
  actionButton: {
    backgroundColor: AppColors.azul,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonDisabled: { opacity: 0.75 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultCard: {
    marginTop: 18,
    backgroundColor: '#f2fbf2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b9e2b8',
    padding: 16,
    gap: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#1f6619', flex: 1 },
  resultRow: { fontSize: 14, color: '#2c472a', lineHeight: 20 },
  resultLabel: { fontWeight: '700' },
  resultDisclaimer: {
    fontSize: 12,
    color: '#4c6b4a',
    marginTop: 6,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});