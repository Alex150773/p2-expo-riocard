import { AppColors } from '@/constants/theme';
import { CARTOES_DEMO } from '@/data/cartoes';
import { Ionicons } from '@expo/vector-icons';
import { registrarRecarga } from '@/services/historico-recargas';
import { enviarRecargaApi } from '@/services/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatar = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ConfirmarRecargaScreen() {
  const { cartaoId, valor: valorParam } = useLocalSearchParams<{ cartaoId?: string; valor?: string }>();
  const cartao = CARTOES_DEMO.find((item) => item.id === cartaoId);
  const valor = Number(valorParam);
  const valorValido = Number.isFinite(valor) && [10, 20, 30, 50, 100].includes(valor);
  const [confirmado, setConfirmado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [enviadoApi, setEnviadoApi] = useState(false);
  const bloqueado = useRef(false);

  async function confirmar() {
    if (!cartao || !valorValido || bloqueado.current) return;
    bloqueado.current = true;
    setSalvando(true);
    try {
      const recarga = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        cartaoId: cartao.id,
        valor,
        data: new Date().toISOString(),
      };
      await registrarRecarga(recarga);
      setConfirmado(true);
      try {
        await enviarRecargaApi(recarga);
        setEnviadoApi(true);
      } catch {
        setEnviadoApi(false);
      }
    } catch {
      Alert.alert('Não foi possível salvar', 'Tente confirmar novamente. Nenhuma recarga real foi realizada.');
    } finally {
      setSalvando(false);
      bloqueado.current = false;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => confirmado ? router.replace('/') : router.back()} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{confirmado ? 'Simulação concluída' : 'Confirmar recarga'}</Text>
        <View style={{ width: 28 }} />
      </View>
      {!cartao || !valorValido ? (
        <View style={styles.content}>
          <Text style={styles.title}>Dados da recarga inválidos</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/selecionar-cartoes')}>
            <Text style={styles.buttonText}>Selecionar cartão novamente</Text>
          </TouchableOpacity>
        </View>
      ) : confirmado ? (
        <View style={styles.success}>
          <Ionicons name="checkmark-circle-outline" size={74} color="#25803b" />
          <Text style={styles.title}>Recarga simulada com sucesso!</Text>
          <Text style={styles.description}>Cartão: {cartao.nome}</Text>
          <Text style={styles.description}>Valor: {formatar(valor)}</Text>
          <Text style={styles.notice}>Nenhuma cobrança ou crédito real foi realizado. Esta operação foi salva no histórico deste dispositivo.</Text>
          <Text style={styles.notice}>{enviadoApi ? 'Registro demonstrativo enviado à API.' : 'Registro salvo somente no celular. A API está indisponível ou não confirmou o envio.'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/historico-recargas')}>
            <Text style={styles.buttonText}>Ver histórico de recargas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace('/')}>
            <Text style={styles.cancelText}>Voltar ao início</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Confira os dados</Text>
            <View style={styles.summary}>
              <Text style={styles.label}>Tipo de recarga</Text>
              <Text style={styles.value}>Comum (simulada)</Text>
              <View style={styles.divider} />
              <Text style={styles.label}>Cartão</Text>
              <Text style={styles.value}>{cartao.nome}</Text>
              <Text style={styles.secondary}>{cartao.numero}</Text>
              <View style={styles.divider} />
              <Text style={styles.label}>Valor</Text>
              <Text style={styles.amount}>{formatar(valor)}</Text>
            </View>
            <Text style={styles.notice}>Demonstração acadêmica: esta confirmação não realiza pagamento, não altera saldo. A operação será salva neste dispositivo e, se a API estiver disponível, também no servidor de demonstração.</Text>
          </ScrollView>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Alterar valor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.footerButton, salvando && { opacity: 0.6 }]} disabled={salvando} onPress={confirmar}>
            <Text style={styles.buttonText}>{salvando ? 'Salvando...' : 'Confirmar simulação'}</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9faf7' },
  header: { height: 95, backgroundColor: AppColors.azul, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 35, flexGrow: 1 },
  title: { color: AppColors.azul, fontSize: 25, fontWeight: '700', marginBottom: 20 },
  summary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 20 },
  label: { color: '#777', fontSize: 15, marginBottom: 5 },
  value: { color: '#222', fontSize: 20, fontWeight: '600' },
  secondary: { color: '#666', fontSize: 15, marginTop: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 18 },
  amount: { color: AppColors.azul, fontSize: 30, fontWeight: '700' },
  notice: { color: '#666', fontSize: 14, lineHeight: 21, marginTop: 24 },
  footerButton: { backgroundColor: AppColors.azul, minHeight: 65, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { alignItems: 'center', padding: 17 },
  cancelText: { color: AppColors.azul, fontSize: 17, fontWeight: '600' },
  button: { backgroundColor: AppColors.azul, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  success: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  description: { fontSize: 18, color: '#333', marginTop: 9 },
});
