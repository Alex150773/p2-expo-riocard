import { AppColors } from '@/constants/theme';
import { CARTOES_DEMO } from '@/data/cartoes';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VALORES = [10, 20, 30, 50, 100];
const formatar = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ValorRecargaScreen() {
  const { cartaoId } = useLocalSearchParams<{ cartaoId?: string }>();
  const cartao = CARTOES_DEMO.find((item) => item.id === cartaoId);
  const [valor, setValor] = useState<number>(20);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Valor da recarga</Text>
        <View style={{ width: 28 }} />
      </View>
      {!cartao ? (
        <View style={styles.content}>
          <Text style={styles.title}>Cartão não encontrado</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/selecionar-cartoes')}>
            <Text style={styles.buttonText}>Selecionar cartão</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Escolha o valor da recarga</Text>
            <View style={styles.card}>
              <Text style={styles.label}>Cartão selecionado</Text>
              <Text style={styles.cardName}>{cartao.nome}</Text>
              <Text style={styles.label}>{cartao.numero}</Text>
            </View>
            <Text style={styles.subtitle}>Valores disponíveis</Text>
            <View style={styles.grid}>
              {VALORES.map((opcao) => (
                <TouchableOpacity
                  key={opcao}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: valor === opcao }}
                  style={[styles.valueOption, valor === opcao && styles.selected]}
                  onPress={() => setValor(opcao)}
                >
                  <Text style={[styles.valueText, valor === opcao && styles.selectedText]}>{formatar(opcao)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.notice}>Simulação acadêmica. Nenhum valor será cobrado.</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push({ pathname: '/confirmar-recarga', params: { cartaoId: cartao.id, valor: String(valor) } })}
          >
            <Text style={styles.buttonText}>Continuar · {formatar(valor)}</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9faf7' },
  header: { height: 95, backgroundColor: AppColors.azul, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitle: { color: '#fff', fontSize: 21, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 36, flexGrow: 1 },
  title: { fontSize: 25, color: AppColors.azul, fontWeight: '700', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 20, marginBottom: 24 },
  label: { color: '#666', fontSize: 15, marginTop: 5 },
  cardName: { color: '#222', fontSize: 21, fontWeight: '700', marginTop: 7 },
  subtitle: { color: '#333', fontSize: 19, fontWeight: '600', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  valueOption: { minWidth: '46%', flexGrow: 1, paddingVertical: 18, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' },
  selected: { borderWidth: 2, borderColor: AppColors.azul, backgroundColor: '#e9f4ff' },
  valueText: { color: '#333', fontSize: 19, fontWeight: '600' },
  selectedText: { color: AppColors.azul },
  notice: { marginTop: 28, fontSize: 14, lineHeight: 20, color: '#666' },
  button: { backgroundColor: AppColors.azul, padding: 18, borderRadius: 10, alignItems: 'center' },
  footerButton: { backgroundColor: AppColors.azul, minHeight: 65, alignItems: 'center', justifyContent: 'center', padding: 12 },
  buttonText: { color: '#fff', fontSize: 19, fontWeight: '600' },
});
