import { Platform } from 'react-native';
import type { Cartao } from '@/data/cartoes';

/**
 * Defina EXPO_PUBLIC_API_URL no arquivo .env da raiz do aplicativo.
 * No celular, use o IPv4 local do computador, nunca localhost.
 */
const URL_CONFIGURADA = process.env.EXPO_PUBLIC_API_URL?.trim();

export function obterEnderecoApi(): string {
  if (URL_CONFIGURADA) return URL_CONFIGURADA.replace(/\/+$/, '');
  if (Platform.OS === 'web') return 'http://localhost:3001';
  throw new Error('Configure EXPO_PUBLIC_API_URL com o IP do computador (ex.: http://192.168.1.10:3001).');
}

export type UsuarioApi = {
  id: string | number;
  [campo: string]: unknown;
};

export type ServicoApi = {
  id: string | number;
  [campo: string]: unknown;
};

async function consultar<T>(caminho: string): Promise<T> {
  const endereco = obterEnderecoApi();
  const controlador = new AbortController();
  const tempoLimite = setTimeout(() => controlador.abort(), 8000);
  try {
    const resposta = await fetch(`${endereco}${caminho}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controlador.signal,
    });
    if (!resposta.ok) throw new Error(`A API retornou o código HTTP ${resposta.status}.`);
    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw new Error('A API demorou para responder. Confira a rede e se o servidor está ligado.');
    }
    if (erro instanceof TypeError) {
      throw new Error('Não foi possível acessar a API. Verifique o endereço, o Wi-Fi e a porta 3001.');
    }
    throw erro;
  } finally {
    clearTimeout(tempoLimite);
  }
}

export const listarCartoesApi = () => consultar<Cartao[]>('/cartoes');
export const listarUsuariosApi = () => consultar<UsuarioApi[]>('/usuarios');
export const listarServicosApi = () => consultar<ServicoApi[]>('/servicos');
