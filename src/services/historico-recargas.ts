import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@p2_expo:historico_recargas:v1';

export type RecargaSimulada = {
  id: string;
  cartaoId: string;
  valor: number;
  data: string;
};

export async function listarRecargas(): Promise<RecargaSimulada[]> {
  const salvo = await AsyncStorage.getItem(CHAVE);
  if (!salvo) return [];
  const dados: unknown = JSON.parse(salvo);
  if (!Array.isArray(dados)) throw new Error('Histórico inválido');
  return dados.filter((item): item is RecargaSimulada =>
    item !== null && typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.cartaoId === 'string' &&
    typeof item.valor === 'number' &&
    typeof item.data === 'string'
  );
}

export async function registrarRecarga(recarga: RecargaSimulada): Promise<void> {
  const historico = await listarRecargas();
  if (historico.some((item) => item.id === recarga.id)) return;
  await AsyncStorage.setItem(CHAVE, JSON.stringify([recarga, ...historico]));
}
