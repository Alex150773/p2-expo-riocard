
import { AppColors } from '@/constants/theme';
import { cadastrarCartaoLocal } from '@/services/cartoes-locais';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdicionarCartaoScreen() {
  const [numero, setNumero] = useState('');
  const [apelido, setApelido] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (salvando) return;

    setSalvando(true);

    try {
      await cadastrarCartaoLocal(numero, apelido);

      Alert.alert(
        'Cartão adicionado',
        'Seu cartão demonstrativo foi salvo com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/cartoes'),
          },
        ]
      );
    } catch (erro) {
      Alert.alert(
        'Não foi possível adicionar',
        erro instanceof Error
          ? erro.message
          : 'Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Adicionar cartão</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Ionicons
            name="card-outline"
            size={58}
            color={AppColors.azul}
          />

          <Text style={styles.title}>Cadastrar novo cartão</Text>

          <Text style={styles.description}>
            Adicione um cartão demonstrativo para utilizar nas
            funcionalidades do aplicativo.
          </Text>

          <Text style={styles.label}>Número do cartão</Text>

          <TextInput
            style={styles.input}
            value={numero}
            onChangeText={setNumero}
            placeholder="Digite o número do cartão"
            keyboardType="number-pad"
            maxLength={24}
            accessibilityLabel="Número do cartão"
          />

          <Text style={styles.hint}>
            Informe de 8 a 20 dígitos.
          </Text>

          <Text style={styles.label}>Apelido (opcional)</Text>

          <TextInput
            style={styles.input}
            value={apelido}
            onChangeText={setApelido}
            placeholder="Ex.: Cartão do trabalho"
            maxLength={40}
            accessibilityLabel="Apelido do cartão"
          />

          <Text style={styles.notice}>
            Este cadastro é demonstrativo e não consulta cartões reais.
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.button,
            salvando && styles.buttonDisabled,
          ]}
          disabled={salvando}
          onPress={salvar}
        >
          <Text style={styles.buttonText}>
            {salvando ? 'Salvando...' : 'Salvar cartão'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9faf7',
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 95,
    backgroundColor: AppColors.azul,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '700',
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: AppColors.azul,
    marginTop: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 28,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 9,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    color: '#222',
  },
  hint: {
    fontSize: 13,
    color: '#777',
    marginTop: 7,
  },
  notice: {
    fontSize: 14,
    color: '#666',
    lineHeight: 21,
    marginTop: 30,
  },
  button: {
    backgroundColor: AppColors.azul,
    minHeight: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
  },
});
