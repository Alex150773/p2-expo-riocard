import { AppColors } from '@/constants/theme';
import { CARTOES_DEMO } from '@/data/cartoes';
import { listarRecargasApi } from '@/services/api';
import {
  listarRecargas,
  sincronizarRecargasEmSegundoPlano,
  type RecargaSimulada,
} from '@/services/historico-recargas';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
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

export default function HistoricoRecargasScreen() {
  const { cartaoId } = useLocalSearchParams<{ cartaoId?: string }>();
  const filtroInicial = CARTOES_DEMO.some((cartao) => cartao.id === cartaoId)
    ? cartaoId!
    : 'todos';
  const [historico, setHistorico] = useState<RecargaSimulada[]>([]);
  const [idsSincronizados, setIdsSincronizados] = useState<Set<string>>(new Set());
  const [apiDisponivel, setApiDisponivel] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [filtro, setFiltro] = useState(filtroInicial);

  const atualizar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      await sincronizarRecargasEmSegundoPlano();
      const locais = await listarRecargas();
      setHistorico(locais);

      try {
        const remotas = await listarRecargasApi();
        setIdsSincronizados(new Set(remotas.map((item) => item.id)));
        setApiDisponivel(true);
      } catch {
        setIdsSincronizados(new Set());
        setApiDisponivel(false);
      }
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setFiltro(filtroInicial);
      void atualizar();
    }, [atualizar, filtroInicial])
  );

  const registros = historico.filter(
    (item) => filtro === 'todos' || item.cartaoId === filtro
  );
  const totalSimulado = registros.reduce((soma, item) => soma + item.valor, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Voltar" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de recargas</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Recargas simuladas salvas neste dispositivo. Nenhum pagamento ou crédito real foi realizado.
        </Text>

        <View style={styles.filters}>
          {[{ id: 'todos', nome: 'Todos' }, ...CARTOES_DEMO].map((cartao) => (
            <TouchableOpacity
              key={cartao.id}
              style={[styles.filter, filtro === cartao.id && styles.filterActive]}
              onPress={() => setFiltro(cartao.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  filtro === cartao.id && styles.filterTextActive,
                ]}
              >
                {cartao.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!carregando && !erro && registros.length > 0 ? (
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>Total simulado ({registros.length})</Text>
              <Text style={styles.summaryValue}>{moeda(totalSimulado)}</Text>
            </View>
            <View style={styles.apiStatusBadge}>
              <Ionicons
                name={apiDisponivel ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={16}
                color={apiDisponivel ? '#278020' : '#777'}
              />
              <Text
                style={[
                  styles.apiStatusText,
                  { color: apiDisponivel ? '#278020' : '#777' },
                ]}
              >
                {apiDisponivel ? 'API conectada' : 'Modo local'}
              </Text>
            </View>
          </View>
        ) : null}

        {carregando ? (
          <ActivityIndicator size="large" color={AppColors.azul} />
        ) : erro ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Não foi possível carregar o histórico.</Text>
            <TouchableOpacity style={styles.button} onPress={() => void atualizar()}>
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : registros.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma recarga simulada encontrada para este filtro.
          </Text>
        ) : (
          registros.map((registro) => {
            const cartao = CARTOES_DEMO.find((item) => item.id === registro.cartaoId);
            const sincronizada = apiDisponivel && idsSincronizados.has(registro.id);

            return (
              <View style={styles.entry} key={registro.id}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {cartao?.nome ?? 'Cartão não encontrado'}
                  </Text>
                  <View
                    style={[
                      styles.syncBadge,
                      sincronizada ? styles.syncBadgeOk : styles.syncBadgeLocal,
                    ]}
                  >
                    <Text
                      style={[
                        styles.syncBadgeText,
                        sincronizada
                          ? styles.syncBadgeTextOk
                          : styles.syncBadgeTextLocal,
                      ]}
                    >
                      {sincronizada ? 'Sincronizada' : 'Salva localmente'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.amount}>{moeda(registro.valor)}</Text>
                <Text style={styles.entryDate}>
                  {new Date(registro.data).toLocaleString('pt-BR')}
                </Text>
                <Text style={styles.simulated}>Recarga simulada</Text>
              </View>
            );
          })
        )}
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
  content: { padding: 18, paddingBottom: 35 },
  description: { fontSize: 15, lineHeight: 22, color: '#555', marginBottom: 18 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  filter: {
    borderColor: AppColors.azul,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  filterActive: { backgroundColor: AppColors.azul },
  filterText: { color: AppColors.azul, fontSize: 14 },
  filterTextActive: { color: '#fff' },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dce6f2',
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: { fontSize: 13, color: '#666' },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.azul,
    marginTop: 4,
  },
  apiStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f3f6f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  apiStatusText: { fontSize: 12, fontWeight: '600' },
  entry: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    padding: 18,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  entryTitle: { fontSize: 18, fontWeight: '700', color: '#333', flex: 1 },
  syncBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  syncBadgeOk: { backgroundColor: '#e6f5e6' },
  syncBadgeLocal: { backgroundColor: '#eef2f6' },
  syncBadgeText: { fontSize: 11, fontWeight: '700' },
  syncBadgeTextOk: { color: '#278020' },
  syncBadgeTextLocal: { color: '#555' },
  amount: { fontSize: 25, fontWeight: '700', color: AppColors.azul, marginTop: 7 },
  entryDate: { fontSize: 14, color: '#666', marginTop: 8 },
  simulated: { fontSize: 13, color: '#777', marginTop: 7 },
  empty: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 25 },
  button: {
    backgroundColor: AppColors.azul,
    borderRadius: 8,
    padding: 14,
    marginTop: 15,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});