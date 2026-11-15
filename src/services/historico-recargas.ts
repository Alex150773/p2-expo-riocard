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

/**
 * Envia registros locais ausentes na API. A comparação por ID evita
 * reenviar uma operação que já foi registrada no servidor.
 * Se a rede falhar, os registros permanecem no AsyncStorage.
 */
export async function sincronizarRecargas(): Promise<{ enviadas: number; total: number }> {
  const { listarRecargasApi, enviarRecargaApi } = await import('./api');
  const locais = await listarRecargas();
  const remotas = await listarRecargasApi();
  if (!Array.isArray(remotas)) throw new Error('Resposta inválida da API.');

  const idsRemotos = new Set(remotas.map((item) => item.id));
  let enviadas = 0;
  // Da mais antiga para a mais recente, mantendo a ordem de registro.
  for (const recarga of [...locais].reverse()) {
    if (idsRemotos.has(recarga.id)) continue;
    try {
      await enviarRecargaApi(recarga);
      idsRemotos.add(recarga.id);
      enviadas++;
    } catch (erro) {
      // Uma falha pode ocorrer após o servidor gravar a recarga.
      // Na próxima tentativa, a consulta por ID impedirá duplicação.
      throw erro;
    }
  }
  return { enviadas, total: locais.length };
}

// Evita sincronizações simultâneas iniciadas por telas diferentes.
let sincronizacaoEmAndamento: Promise<void> | null = null;

export function sincronizarRecargasEmSegundoPlano(): Promise<void> {
  if (sincronizacaoEmAndamento) return sincronizacaoEmAndamento;
  const tarefa = sincronizarRecargas().then(() => undefined).catch(() => undefined);
  sincronizacaoEmAndamento = tarefa;
  void tarefa.finally(() => {
    if (sincronizacaoEmAndamento === tarefa) sincronizacaoEmAndamento = null;
  });
  return tarefa;
}
