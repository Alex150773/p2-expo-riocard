import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { listarCartoesApi, listarServicosApi, listarUsuariosApi, obterEnderecoApi } from '@/services/api';

type Resultado = { cartoes: number; usuarios: number; servicos: number };

export default function TestarApiScreen() {
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState('');

  async function testar() {
    setCarregando(true);
    setErro('');
    setResultado(null);
    try {
      const [cartoes, usuarios, servicos] = await Promise.all([
        listarCartoesApi(), listarUsuariosApi(), listarServicosApi(),
      ]);
      if (!Array.isArray(cartoes) || !Array.isArray(usuarios) || !Array.isArray(servicos)) {
        throw new Error('A API retornou dados em formato inesperado.');
      }
      setResultado({ cartoes: cartoes.length, usuarios: usuarios.length, servicos: servicos.length });
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Erro desconhecido ao consultar a API.');
    } finally {
      setCarregando(false);
    }
  }

  let endereco = 'Não configurado';
  try { endereco = obterEnderecoApi(); } catch { /* O botão apresenta o erro detalhado. */ }

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Testar conexão com a API</Text>
        <Text style={styles.rotulo}>Endereço configurado:</Text>
        <Text selectable style={styles.endereco}>{endereco}</Text>
        <Text style={styles.ajuda}>Inicie o JSON Server na pasta api e mantenha o celular e o computador na mesma rede Wi-Fi.</Text>
        <TouchableOpacity onPress={testar} disabled={carregando} style={styles.botao} accessibilityRole="button">
          <Text style={styles.botaoTexto}>{carregando ? 'Consultando...' : 'Testar API'}</Text>
        </TouchableOpacity>
        {carregando && <ActivityIndicator size="large" color="#087DDD" />}
        {resultado && <View style={styles.sucesso}>
          <Text style={styles.sucessoTitulo}>Conexão realizada com sucesso!</Text>
          <Text>Cartões: {resultado.cartoes}</Text>
          <Text>Usuários: {resultado.usuarios}</Text>
          <Text>Serviços: {resultado.servicos}</Text>
        </View>}
        {!!erro && <Text style={styles.erro}>{erro}</Text>}
        <Text style={styles.nota}>Esta tela verifica a comunicação HTTP. A integração dos cartões às telas será feita no próximo commit.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#fff' },
  conteudo: { padding: 24, gap: 16 },
  voltar: { fontSize: 18, color: '#087DDD' },
  titulo: { fontSize: 24, fontWeight: '700', color: '#123' },
  rotulo: { color: '#555' },
  endereco: { padding: 12, backgroundColor: '#f0f5fa', borderRadius: 8 },
  ajuda: { color: '#555', lineHeight: 22 },
  botao: { backgroundColor: '#087DDD', padding: 16, borderRadius: 9, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  sucesso: { padding: 18, borderRadius: 9, backgroundColor: '#e8f7eb', gap: 8 },
  sucessoTitulo: { color: '#176b35', fontWeight: '700' },
  erro: { color: '#a21d1d', padding: 14, backgroundColor: '#fff0f0', borderRadius: 8 },
  nota: { marginTop: 12, color: '#666', lineHeight: 20 },
});
