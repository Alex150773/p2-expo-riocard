import { listarServicosApi, type ServicoApi } from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AZUL = '#087DDD';
const CINZA = '#777';

const SERVICOS_API_FALLBACK: ServicoApi[] = [
  {
    id: 'recarga',
    nome: 'Recarga',
    descricao: 'Escolha um valor para recarga',
  },
  {
    id: 'historico',
    nome: 'Histórico de recargas',
    descricao: 'Consulte operações salvas localmente no aparelho',
  },
  {
    id: 'cartoes',
    nome: 'Meus cartões',
    descricao: 'Consulte cartões demonstrativos',
  },
];

const ROTAS_POR_ID: Record<string, string> = {
  recarga: '/recarga',
  historico: '/historico-recargas',
  cartoes: '/cartoes',
  perfil: '/perfil',
};

const ICONES_POR_ID: Record<string, string> = {
  recarga: 'cash-outline',
  historico: 'time-outline',
  cartoes: 'card-outline',
  perfil: 'person-outline',
};

const servicosMenu = [
  { nome: 'Perfil', icone: 'person-outline', rota: '/perfil' },
  {
    nome: 'Gerenciar pagamento',
    icone: 'wallet-outline',
    info: 'Função demonstrativa: nenhuma forma de pagamento real é cadastrada neste projeto.',
  },
  { nome: 'Cartão Digital', icone: 'phone-portrait-outline', rota: '/cartao/digital' },
  { nome: 'Meus Cartões', icone: 'card-outline', rota: '/cartoes' },
  { nome: 'Histórico de recargas', icone: 'time-outline', rota: '/historico-recargas' },
  {
    nome: 'Meus pedidos',
    icone: 'receipt-outline',
    info: 'Consulte suas recargas na opção Histórico de recargas.',
  },
  { nome: 'Recarregue seu cartão', icone: 'cash-outline', rota: '/recarga' },
  {
    nome: 'Recarregue automaticamente',
    icone: 'refresh-outline',
    info: 'Função demonstrativa: recarga automática indisponível no modo acadêmico.',
  },
  {
    nome: 'Onde validar',
    icone: 'location-outline',
    info: 'A validação ocorre nos validadores de ônibus, trens, metrô, barcas e VLT.',
  },
  {
    nome: 'Perguntas frequentes (FAQ)',
    icone: 'help-circle-outline',
    info: 'Este aplicativo é um protótipo acadêmico. Saldos e recargas são apenas simulações.',
  },
  {
    nome: 'Onde estamos',
    icone: 'map-outline',
    info: 'Lojas e terminais de atendimento Riocard Mais no Estado do Rio de Janeiro.',
  },
  {
    nome: 'Clube Riocard Mais',
    icone: 'star-outline',
    info: 'Programa de vantagens demonstrativo.',
  },
  {
    nome: 'Código de autorização',
    icone: 'key-outline',
    info: 'Nenhuma autorização pendente para os cartões demonstrativos.',
  },
  {
    nome: 'Fiscalização',
    icone: 'shield-checkmark-outline',
    info: 'Canal informativo de uso regular dos cartões de transporte.',
  },
  {
    nome: 'Central de notificações',
    icone: 'notifications-outline',
    info: 'Você não possui novas notificações no momento.',
  },
  {
    nome: 'Avaliar o aplicativo',
    icone: 'thumbs-up-outline',
    info: 'Obrigado por testar o protótipo da disciplina de Desenvolvimento de Aplicativos Híbridos!',
  },
];

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function ServicosScreen() {
  const [servicosApi, setServicosApi] = useState<ServicoApi[]>(SERVICOS_API_FALLBACK);
  const [carregando, setCarregando] = useState(true);
  const [modoDemonstrativo, setModoDemonstrativo] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarServicos() {
      try {
        const lista = await listarServicosApi();
        if (!ativo) return;
        if (Array.isArray(lista) && lista.length > 0) {
          setServicosApi(lista);
          setModoDemonstrativo(false);
        } else {
          setServicosApi(SERVICOS_API_FALLBACK);
          setModoDemonstrativo(true);
        }
      } catch {
        if (!ativo) return;
        setServicosApi(SERVICOS_API_FALLBACK);
        setModoDemonstrativo(true);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarServicos();
    return () => {
      ativo = false;
    };
  }, []);

  function abrirServicoApi(servico: ServicoApi) {
    const chave = String(servico.id);
    const rota = ROTAS_POR_ID[chave];
    if (rota) {
      router.push(rota as any);
      return;
    }
    Alert.alert(
      String(servico.nome ?? 'Serviço'),
      String(servico.descricao ?? 'Serviço demonstrativo.')
    );
  }

  const termoBusca = normalizarTexto(busca);

  const servicosApiFiltrados = servicosApi.filter((item) => {
    if (!termoBusca) return true;
    const nome = normalizarTexto(String(item.nome ?? ''));
    const descricao = normalizarTexto(String(item.descricao ?? ''));
    return nome.includes(termoBusca) || descricao.includes(termoBusca);
  });

  const servicosMenuFiltrados = servicosMenu.filter((item) => {
    if (!termoBusca) return true;
    return normalizarTexto(item.nome).includes(termoBusca);
  });

  const nenhumResultado =
    !carregando &&
    servicosApiFiltrados.length === 0 &&
    servicosMenuFiltrados.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>

        <View style={styles.logo}>
          <Text style={styles.logoRio}>riocard++</Text>
          <Text style={styles.logoMais}>mais</Text>
        </View>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Serviços</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar serviço..."
            placeholderTextColor="#888"
            value={busca}
            onChangeText={setBusca}
            autoCorrect={false}
          />
          {busca.length > 0 ? (
            <TouchableOpacity
              accessibilityLabel="Limpar busca"
              onPress={() => setBusca('')}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>

        {nenhumResultado ? (
          <View style={styles.emptySearch}>
            <Ionicons name="search-outline" size={36} color="#999" />
            <Text style={styles.emptySearchText}>
              Nenhum serviço encontrado para &quot;{busca}&quot;.
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setBusca('')}
            >
              <Text style={styles.clearButtonText}>Limpar filtro</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {carregando || servicosApiFiltrados.length > 0 ? (
          <View style={styles.destaqueBox}>
            <View style={styles.destaqueHeader}>
              <Text style={styles.destaqueTitulo}>Serviços em destaque</Text>
              <Text style={styles.destaqueBadge}>
                {modoDemonstrativo ? 'Local' : 'API'}
              </Text>
            </View>

            {carregando ? (
              <ActivityIndicator color={AZUL} style={{ marginVertical: 12 }} />
            ) : (
              servicosApiFiltrados.map((item) => {
                const idStr = String(item.id);
                const icone = ICONES_POR_ID[idStr] ?? 'apps-outline';
                return (
                  <TouchableOpacity
                    key={idStr}
                    style={styles.destaqueItem}
                    onPress={() => abrirServicoApi(item)}
                  >
                    <Ionicons name={icone as any} size={24} color={AZUL} />
                    <View style={styles.destaqueTextoBox}>
                      <Text style={styles.destaqueNome}>
                        {String(item.nome ?? 'Serviço')}
                      </Text>
                      {item.descricao ? (
                        <Text style={styles.destaqueDescricao}>
                          {String(item.descricao)}
                        </Text>
                      ) : null}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : null}

        {servicosMenuFiltrados.length > 0 ? (
          <>
            <Text style={styles.subtitulo}>Todos os serviços</Text>

            {servicosMenuFiltrados.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceRow}
                onPress={() => {
                  if (item.rota) {
                    router.push(item.rota as any);
                  } else if (item.info) {
                    Alert.alert(item.nome, item.info);
                  }
                }}
              >
                <Ionicons name={item.icone as any} size={25} color={AZUL} />

                <Text style={styles.serviceText}>{item.nome}</Text>

                <Ionicons name="chevron-forward" size={22} color="#999" />
              </TouchableOpacity>
            ))}
          </>
        ) : null}

        <View style={styles.extraArea}>
          <Text style={styles.version}>Versão 2.68.7-P</Text>
          <Text style={styles.versionInfo}>Aplicativo Riocard Mais</Text>

          <TouchableOpacity
            style={styles.report}
            onPress={() =>
              Alert.alert(
                'Disque denúncia',
                'Canal demonstrativo para registro de irregularidades no transporte.'
              )
            }
          >
            <MaterialCommunityIcons
              name="phone-alert-outline"
              size={25}
              color={AZUL}
            />
            <Text style={styles.reportText}>Disque denúncia</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="log-out-outline" size={25} color="#d33" />
            <Text style={styles.logoutText}>Sair do app</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem
          icon="home-outline"
          label="Início"
          onPress={() => router.replace('/')}
        />

        <NavItem
          icon="card-outline"
          label={'Meus\ncartões'}
          onPress={() => router.push('/cartoes')}
        />

        <TouchableOpacity
          style={styles.rechargeNav}
          onPress={() => router.push('/recarga')}
        >
          <View style={styles.rechargeCircle}>
            <MaterialCommunityIcons name="cash-plus" size={28} color="#fff" />
          </View>
          <Text style={styles.navText}>Recarga</Text>
        </TouchableOpacity>

        <NavItem
          icon="star-outline"
          label="Clube"
          onPress={() =>
            Alert.alert('Clube Riocard Mais', 'Área de vantagens demonstrativa.')
          }
        />

        <NavItem icon="menu" label="Serviços" active />
      </View>
    </SafeAreaView>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={27} color={active ? AZUL : CINZA} />
      <Text style={[styles.navText, active && styles.navActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9faf7',
  },

  header: {
    height: 125,
    backgroundColor: AZUL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  logo: {
    alignItems: 'center',
  },

  logoRio: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 29,
  },

  logoMais: {
    color: '#fff',
    fontSize: 27,
    fontWeight: 'bold',
    lineHeight: 28,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 30,
  },

  title: {
    color: AZUL,
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dce2e8',
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 18,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },

  emptySearch: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
  },

  emptySearchText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },

  clearButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: AZUL,
  },

  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  destaqueBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e6ea',
  },

  destaqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  destaqueTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },

  destaqueBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AZUL,
    backgroundColor: '#e6f2fc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  destaqueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  destaqueTextoBox: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  destaqueNome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  destaqueDescricao: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 6,
  },

  serviceRow: {
    minHeight: 61,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  serviceText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },

  extraArea: {
    paddingTop: 25,
  },

  version: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },

  versionInfo: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: -14,
    marginBottom: 18,
  },

  report: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  reportText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 15,
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  logoutText: {
    color: '#d33',
    fontSize: 16,
    marginLeft: 15,
  },

  bottomNav: {
    height: 82,
    flexDirection: 'row',
    backgroundColor: '#fafbf8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rechargeNav: {
    flex: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rechargeCircle: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -19,
  },

  navText: {
    color: CINZA,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 3,
  },

  navActive: {
    color: AZUL,
  },
});