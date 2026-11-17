import {
  atualizarUsuarioApi,
  listarUsuariosApi,
  type UsuarioApi,
} from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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
const CHAVE_PERFIL = '@p2_expo:perfil_usuario:v1';

const USUARIO_FALLBACK: UsuarioApi = {
  id: 'demo',
  nome: 'Usuário de Demonstração',
  email: 'demo@example.com',
};

const opcoes = [
  { id: 'dados', nome: 'Meus dados (editar)', icone: 'person-outline' },
  { id: 'termos', nome: 'Termos de uso', icone: 'document-text-outline' },
  { id: 'privacidade', nome: 'Política de privacidade', icone: 'lock-closed-outline' },
  { id: 'excluir', nome: 'Restaurar dados padrão', icone: 'refresh-outline' },
];

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState<UsuarioApi>(USUARIO_FALLBACK);
  const [carregando, setCarregando] = useState(true);
  const [modoDemonstrativo, setModoDemonstrativo] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [emailEdicao, setEmailEdicao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      let perfilLocal: UsuarioApi | null = null;
      try {
        const salvo = await AsyncStorage.getItem(CHAVE_PERFIL);
        if (salvo) perfilLocal = JSON.parse(salvo) as UsuarioApi;
      } catch {
        // Ignora falha de leitura local.
      }

      try {
        const lista = await listarUsuariosApi();
        if (!ativo) return;
        if (Array.isArray(lista) && lista.length > 0) {
          const base = perfilLocal ?? lista[0];
          setUsuario(base);
          setModoDemonstrativo(false);
        } else {
          setUsuario(perfilLocal ?? USUARIO_FALLBACK);
          setModoDemonstrativo(true);
        }
      } catch {
        if (!ativo) return;
        setUsuario(perfilLocal ?? USUARIO_FALLBACK);
        setModoDemonstrativo(true);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregarPerfil();
    return () => {
      ativo = false;
    };
  }, []);

  function abrirEdicao() {
    setNomeEdicao(String(usuario.nome ?? ''));
    setEmailEdicao(String(usuario.email ?? ''));
    setModalVisivel(true);
  }

  async function salvarPerfil() {
    const nomeLimpo = nomeEdicao.trim();
    const emailLimpo = emailEdicao.trim();

    if (!nomeLimpo || !emailLimpo || !emailLimpo.includes('@')) {
      Alert.alert(
        'Dados inválidos',
        'Informe um nome e um endereço de e-mail válido.'
      );
      return;
    }

    setSalvando(true);
    const atualizado: UsuarioApi = {
      ...usuario,
      nome: nomeLimpo,
      email: emailLimpo,
    };

    try {
      await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(atualizado));
      setUsuario(atualizado);

      try {
        await atualizarUsuarioApi(atualizado.id, {
          nome: nomeLimpo,
          email: emailLimpo,
        });
        setModoDemonstrativo(false);
      } catch {
        setModoDemonstrativo(true);
      }

      setModalVisivel(false);
      Alert.alert('Perfil atualizado', 'Seus dados demonstrativos foram salvos.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados no aparelho.');
    } finally {
      setSalvando(false);
    }
  }

  async function restaurarPadrao() {
    await AsyncStorage.removeItem(CHAVE_PERFIL);
    setUsuario(USUARIO_FALLBACK);
    try {
      await atualizarUsuarioApi('demo', {
        nome: String(USUARIO_FALLBACK.nome),
        email: String(USUARIO_FALLBACK.email),
      });
      setModoDemonstrativo(false);
    } catch {
      setModoDemonstrativo(true);
    }
    Alert.alert('Dados restaurados', 'O perfil voltou ao usuário de demonstração.');
  }

  function aoSelecionarOpcao(id: string) {
    if (id === 'dados') {
      abrirEdicao();
      return;
    }

    if (id === 'termos') {
      Alert.alert(
        'Termos de uso',
        'Aplicativo acadêmico demonstrativo da disciplina de Desenvolvimento de Aplicativos Híbridos. Nenhuma transação financeira real é efetuada.'
      );
      return;
    }

    if (id === 'privacidade') {
      Alert.alert(
        'Política de privacidade',
        'Os dados exibidos são fictícios e armazenados apenas localmente no aparelho e na API simulada de testes.'
      );
      return;
    }

    if (id === 'excluir') {
      Alert.alert(
        'Restaurar dados padrão',
        'Deseja voltar os dados do perfil para o usuário de demonstração?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Restaurar', onPress: () => void restaurarPadrao() },
        ]
      );
    }
  }

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

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Perfil</Text>

        <TouchableOpacity style={styles.cardUsuario} onPress={abrirEdicao}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={30} color="#fff" />
          </View>

          <View style={styles.infoUsuario}>
            {carregando ? (
              <ActivityIndicator color={AZUL} />
            ) : (
              <>
                <Text style={styles.nomeUsuario}>
                  {String(usuario.nome ?? 'Usuário de Demonstração')}
                </Text>
                <Text style={styles.emailUsuario}>
                  {String(usuario.email ?? 'demo@example.com')}
                </Text>
              </>
            )}
          </View>

          <Ionicons name="create-outline" size={22} color={AZUL} />
        </TouchableOpacity>

        {opcoes.map((item) => (
          <TouchableOpacity
            style={styles.row}
            key={item.id}
            onPress={() => aoSelecionarOpcao(item.id)}
          >
            <Ionicons
              name={item.icone as any}
              size={26}
              color={item.id === 'excluir' ? '#d33' : AZUL}
            />

            <Text
              style={[
                styles.rowText,
                item.id === 'excluir' && styles.deleteText,
              ]}
            >
              {item.nome}
            </Text>

            <Ionicons name="chevron-forward" size={23} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar dados do perfil</Text>

            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={nomeEdicao}
              onChangeText={setNomeEdicao}
              placeholder="Seu nome"
            />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={emailEdicao}
              onChangeText={setEmailEdicao}
              placeholder="seuemail@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisivel(false)}
                disabled={salvando}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => void salvarPerfil()}
                disabled={salvando}
              >
                <Text style={styles.saveButtonText}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            <MaterialCommunityIcons
              name="cash-plus"
              size={28}
              color="#fff"
            />
          </View>
          <Text style={styles.navText}>Recarga</Text>
        </TouchableOpacity>

        <NavItem icon="star-outline" label="Clube" />

        <NavItem
          icon="menu"
          label="Serviços"
          onPress={() => router.push('/servicos')}
        />
      </View>
    </SafeAreaView>
  );
}

function NavItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={27} color={CINZA} />
      <Text style={styles.navText}>{label}</Text>
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
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  title: {
    color: AZUL,
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  cardUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e6ea',
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: AZUL,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  infoUsuario: {
    flex: 1,
  },

  nomeUsuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },

  emailUsuario: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },

  statusFonte: {
    fontSize: 12,
    color: AZUL,
    marginTop: 4,
    fontWeight: '500',
  },

  row: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  rowText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },

  deleteText: {
    color: '#d33',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AZUL,
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
    color: '#222',
    backgroundColor: '#fafbfc',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },

  modalButton: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  cancelButton: {
    backgroundColor: '#eef1f4',
  },

  cancelButtonText: {
    color: '#444',
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: AZUL,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
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
});