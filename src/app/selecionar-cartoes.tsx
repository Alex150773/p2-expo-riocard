
import { useCartoes } from '@/hooks/use-cartoes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AZUL = '#087DDD';

export default function SelecionarCartoesScreen() {
  const { cartoes, carregando } = useCartoes();
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

  useEffect(() => {
    if (carregando) return;

    const selecionadoExiste = cartoes.some(
      (cartao) => cartao.id === selecionadoId
    );

    if (!selecionadoExiste) {
      setSelecionadoId(cartoes[0]?.id ?? null);
    }
  }, [cartoes, carregando, selecionadoId]);

  function continuar() {
    if (!selecionadoId) {
      Alert.alert('Selecione um cartão', 'Escolha um cartão para continuar.');
      return;
    }

    router.push({
      pathname: '/valor-recarga',
      params: { cartaoId: selecionadoId },
    });
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

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Escolha um cartão</Text>

        <Text style={styles.subtitle}>
          Selecione o cartão que deseja recarregar
        </Text>

        {carregando ? (
          <Text style={styles.message}>Carregando cartões...</Text>
        ) : null}

        {!carregando && cartoes.length === 0 ? (
          <Text style={styles.message}>
            Nenhum cartão cadastrado.
          </Text>
        ) : null}

        {cartoes.map((cartao) => (
          <TouchableOpacity
            key={cartao.id}
            style={[
              styles.card,
              selecionadoId === cartao.id && styles.cardSelected,
            ]}
            accessibilityRole="radio"
            accessibilityState={{
              checked: selecionadoId === cartao.id,
            }}
            onPress={() => setSelecionadoId(cartao.id)}
          >
            <View
              style={[
                styles.cardImage,
                { backgroundColor: cartao.cor },
              ]}
            >
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={31}
                color="#fff"
              />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{cartao.nome}</Text>
              <Text style={styles.cardNumber}>{cartao.numero}</Text>
            </View>

            <Ionicons
              name={
                selecionadoId === cartao.id
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={26}
              color={AZUL}
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push('/adicionar-cartao')}
        >
          <Ionicons name="add-circle-outline" size={27} color={AZUL} />
          <Text style={styles.optionText}>Adicionar cartão</Text>
          <Ionicons name="chevron-forward" size={22} color="#888" />
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!selecionadoId || carregando) && styles.buttonDisabled,
        ]}
        disabled={!selecionadoId || carregando}
        onPress={continuar}
      >
        <Text style={styles.continueText}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    padding: 20,
    paddingBottom: 35,
  },

  title: {
    color: AZUL,
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 25,
  },

  message: {
    fontSize: 15,
    color: '#666',
    marginBottom: 18,
  },

  card: {
    minHeight: 95,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 13,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardSelected: {
    borderColor: AZUL,
    borderWidth: 2,
  },

  cardImage: {
    width: 55,
    height: 70,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
  },

  cardName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#333',
  },

  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },

  option: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 14,
  },

  continueButton: {
    height: 67,
    backgroundColor: AZUL,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#9aa4ae',
  },

  continueText: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '600',
  },
});
