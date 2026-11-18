import { AppColors } from '@/constants/theme';
import { useCartoes } from '@/hooks/use-cartoes';
import { listarRecargasApi } from '@/services/api';
import {
    listarRecargas,
    sincronizarRecargasEmSegundoPlano,
    type RecargaSimulada,
} from '@/services/historico-recargas';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
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

export default function MeusPedidosScreen() {
  const { cartoes, carregando: carregandoCartoes } = useCartoes();
  const [pedidos, setPedidos] = useState<RecargaSimulada[]>([]);
  const [idsSincronizados, setIdsSincronizados] = useState<Set<string>>(new Set());
  const [apiDisponivel, setApiDisponivel] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const carregarPedidos = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      await sincronizarRecargasEmSegundoPlano();
      const locais = await listarRecargas();
      setPedidos(locais);

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
      void carregarPedidos();
    }, [carregarPedidos])
  );

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
          Pedidos de recarga demonstrativos registrados no aparelho. Nenhuma cobrança ou pagamento real é realizado.
        </Text>

        {carregando ? (
          <ActivityIndicator size="large" color={AppColors.azul} />
        ) : erro ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Não foi possível carregar os pedidos.</Text>
            <TouchableOpacity style={styles.button} onPress={() => void carregarPedidos()}>
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : pedidos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={34} color={AppColors.azul} />
            <Text style={styles.emptyTitle}>Nenhum pedido registrado</Text>
            <Text style={styles.emptyText}>
              Faça uma recarga demonstrativa para visualizar o pedido nesta lista.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/recarga')}>
              <Text style={styles.buttonText}>Fazer recarga</Text>
            </TouchableOpacity>
          </View>
        ) : (
          pedidos.map((pedido) => {
            const cartao = cartoes.find((item) => item.id === pedido.cartaoId);
            const sincronizado = apiDisponivel && idsSincronizados.has(pedido.id);

            return (
              <View style={styles.card} key={pedido.id}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>
                    {cartao?.nome ??
                      (carregandoCartoes ? 'Carregando cartão...' : 'Cartão não disponível')}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      sincronizado ? styles.statusSync : styles.statusLocal,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        sincronizado ? styles.statusTextSync : styles.statusTextLocal,
                      ]}
                    >
                      {sincronizado ? 'Registrado (Sincronizado)' : 'Registrado localmente'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.amount}>{moeda(pedido.valor)}</Text>
                <Text style={styles.date}>
                  Data: {new Date(pedido.data).toLocaleString('pt-BR')}
                </Text>
                <Text style={styles.demoTag}>Operação demonstrativa • Sem cobrança real</Text>
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
  headerSpacer: { width: 28 },
  content: { padding: 18, paddingBottom: 35 },
  description: { fontSize: 15, lineHeight: 22, color: '#555', marginBottom: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    padding: 18,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#333', flex: 1 },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusSync: { backgroundColor: '#e6f5e6' },
  statusLocal: { backgroundColor: '#eef2f6' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextSync: { color: '#278020' },
  statusTextLocal: { color: '#555' },
  amount: { fontSize: 24, fontWeight: '700', color: AppColors.azul, marginTop: 8 },
  date: { fontSize: 14, color: '#666', marginTop: 6 },
  demoTag: { fontSize: 12, color: '#777', marginTop: 6 },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginTop: 4 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  button: {
    backgroundColor: AppColors.azul,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});