import { AppColors } from "@/constants/theme";
import { CARTOES_DEMO } from "@/data/cartoes";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VALORES = [10, 20, 30, 50, 100];
const VALOR_MAXIMO = 1000;

const formatar = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

function converterValor(texto: string): number | null {
  const entrada = texto.trim();

  if (!/^\d+(?:[,.]\d{1,2})?$/.test(entrada)) {
    return null;
  }

  const numero = Number(entrada.replace(",", "."));

  if (!Number.isFinite(numero) || numero <= 0 || numero > VALOR_MAXIMO) {
    return null;
  }

  return numero;
}

export default function ValorRecargaScreen() {
  const { cartaoId } = useLocalSearchParams<{ cartaoId?: string }>();
  const cartao = CARTOES_DEMO.find((item) => item.id === cartaoId);

  const [valor, setValor] = useState<number>(20);
  const [outroValor, setOutroValor] = useState(false);
  const [valorDigitado, setValorDigitado] = useState("");

  const valorPersonalizado = converterValor(valorDigitado);
  const valorSelecionado = outroValor ? valorPersonalizado : valor;

  function selecionarValor(opcao: number) {
    setValor(opcao);
    setOutroValor(false);
    Keyboard.dismiss();
  }

  function continuar() {
    if (!cartao) {
      return;
    }

    if (valorSelecionado === null) {
      Alert.alert(
        "Valor inválido",
        "Informe um valor entre R$ 0,01 e R$ 1.000,00. Use vírgula para os centavos.",
      );
      return;
    }

    Keyboard.dismiss();

    router.push({
      pathname: "/confirmar-recarga",
      params: {
        cartaoId: cartao.id,
        valor: valorSelecionado.toFixed(2),
      },
    });
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

        <Text style={styles.headerTitle}>Valor da recarga</Text>
        <View style={{ width: 28 }} />
      </View>

      {!cartao ? (
        <View style={styles.content}>
          <Text style={styles.title}>Cartão não encontrado</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/selecionar-cartoes")}
          >
            <Text style={styles.buttonText}>Selecionar cartão</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
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
                  accessibilityState={{
                    selected: !outroValor && valor === opcao,
                  }}
                  style={[
                    styles.valueOption,
                    !outroValor && valor === opcao && styles.selected,
                  ]}
                  onPress={() => selecionarValor(opcao)}
                >
                  <Text
                    style={[
                      styles.valueText,
                      !outroValor && valor === opcao && styles.selectedText,
                    ]}
                  >
                    {formatar(opcao)}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                accessibilityRole="radio"
                accessibilityState={{ selected: outroValor }}
                style={[styles.valueOption, outroValor && styles.selected]}
                onPress={() => setOutroValor(true)}
              >
                <Text
                  style={[styles.valueText, outroValor && styles.selectedText]}
                >
                  Outro valor
                </Text>
              </TouchableOpacity>
            </View>

            {outroValor && (
              <View style={styles.customValue}>
                <Text style={styles.inputLabel}>Digite o valor desejado</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.currencyPrefix}>R$</Text>

                  <TextInput
                    style={styles.input}
                    value={valorDigitado}
                    onChangeText={setValorDigitado}
                    placeholder="Ex.: 25,50"
                    keyboardType="decimal-pad"
                    maxLength={7}
                    accessibilityLabel="Valor personalizado da recarga"
                  />
                </View>

                <Text style={styles.inputHint}>
                  Valor permitido: de R$ 0,01 a R$ 1.000,00.
                </Text>
              </View>
            )}

            <Text style={styles.notice}>
              Simulação acadêmica. Nenhum valor será cobrado.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.footerButton} onPress={continuar}>
            <Text style={styles.buttonText}>
              {valorSelecionado === null
                ? "Continuar"
                : `Continuar · ${formatar(valorSelecionado)}`}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9faf7",
  },
  header: {
    height: 95,
    backgroundColor: AppColors.azul,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    flexGrow: 1,
  },
  title: {
    fontSize: 25,
    color: AppColors.azul,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  label: {
    color: "#666",
    fontSize: 15,
    marginTop: 5,
  },
  cardName: {
    color: "#222",
    fontSize: 21,
    fontWeight: "700",
    marginTop: 7,
  },
  subtitle: {
    color: "#333",
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  valueOption: {
    minWidth: "46%",
    flexGrow: 1,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  selected: {
    borderWidth: 2,
    borderColor: AppColors.azul,
    backgroundColor: "#e9f4ff",
  },
  valueText: {
    color: "#333",
    fontSize: 19,
    fontWeight: "600",
  },
  selectedText: {
    color: AppColors.azul,
  },
  customValue: {
    marginTop: 24,
  },
  inputLabel: {
    color: "#333",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    color: "#333",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 15,
    color: "#222",
  },
  inputHint: {
    marginTop: 8,
    color: "#666",
    fontSize: 13,
  },
  notice: {
    marginTop: 28,
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  button: {
    backgroundColor: AppColors.azul,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  footerButton: {
    backgroundColor: AppColors.azul,
    minHeight: 65,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "600",
  },
});
