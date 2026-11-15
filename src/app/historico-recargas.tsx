import { AppColors } from '@/constants/theme';
import { CARTOES_DEMO } from '@/data/cartoes';
import { listarRecargas, type RecargaSimulada } from '@/services/historico-recargas';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function HistoricoRecargasScreen() {
  const { cartaoId } = useLocalSearchParams<{ cartaoId?: string }>();
  const filtroInicial = CARTOES_DEMO.some((cartao) => cartao.id === cartaoId) ? cartaoId! : 'todos';
  const [historico, setHistorico] = useState<RecargaSimulada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [filtro, setFiltro] = useState(filtroInicial);

  const atualizar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      setHistorico(await listarRecargas());
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    setFiltro(filtroInicial);
    void atualizar();
  }, [atualizar, filtroInicial]));

  const registros = historico.filter((item) => filtro === 'todos' || item.cartaoId === filtro);

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
        <Text style={styles.description}>Recargas simuladas salvas neste dispositivo. Nenhum pagamento ou crédito real foi realizado.</Text>
        <View style={styles.filters}>
          {[{ id: 'todos', nome: 'Todos' }, ...CARTOES_DEMO].map((cartao) => (
            <TouchableOpacity key={cartao.id} style={[styles.filter, filtro === cartao.id && styles.filterActive]} onPress={() => setFiltro(cartao.id)}>
              <Text style={[styles.filterText, filtro === cartao.id && styles.filterTextActive]}>{cartao.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
          <Text style={styles.emptyText}>Nenhuma recarga simulada encontrada para este filtro.</Text>
        ) : registros.map((registro) => {
          const cartao = CARTOES_DEMO.find((item) => item.id === registro.cartaoId);
          return (
            <View style={styles.entry} key={registro.id}>
              <Text style={styles.entryTitle}>{cartao?.nome ?? 'Cartão não encontrado'}</Text>
              <Text style={styles.amount}>{moeda(registro.valor)}</Text>
              <Text style={styles.entryDate}>{new Date(registro.data).toLocaleString('pt-BR')}</Text>
              <Text style={styles.simulated}>Recarga simulada</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9faf7' },
  header: { height: 95, backgroundColor: AppColors.azul, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  content: { padding: 18, paddingBottom: 35 },
  description: { fontSize: 15, lineHeight: 22, color: '#555', marginBottom: 18 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  filter: { borderColor: AppColors.azul, borderWidth: 1, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#fff' },
  filterActive: { backgroundColor: AppColors.azul },
  filterText: { color: AppColors.azul, fontSize: 14 },
  filterTextActive: { color: '#fff' },
  entry: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e4', padding: 18, marginBottom: 12 },
  entryTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  amount: { fontSize: 25, fontWeight: '700', color: AppColors.azul, marginTop: 7 },
  entryDate: { fontSize: 14, color: '#666', marginTop: 8 },
  simulated: { fontSize: 13, color: '#777', marginTop: 7 },
  empty: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 25 },
  button: { backgroundColor: AppColors.azul, borderRadius: 8, padding: 14, marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
