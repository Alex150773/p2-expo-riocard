import { CARTOES_DEMO, type Cartao } from "@/data/cartoes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_CARTOES = "@p2_cartoes_cadastrados";

export function normalizarNumeroCartao(numero: string): string {
  return numero.replace(/\D/g, "");
}

export async function listarCartoesLocais(): Promise<Cartao[]> {
  const dados = await AsyncStorage.getItem(CHAVE_CARTOES);

  if (!dados) return [];

  const resultado: unknown = JSON.parse(dados);

  if (!Array.isArray(resultado)) {
    throw new Error("Os cartões armazenados estão em formato inválido.");
  }

  return resultado.filter(
    (item): item is Cartao =>
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.nome === "string" &&
      typeof item.numero === "string" &&
      typeof item.cor === "string" &&
      typeof item.buiHabilitado === "boolean" &&
      typeof item.saldoDemonstrativo === "number" &&
      Number.isFinite(item.saldoDemonstrativo),
  );
}

export async function cadastrarCartaoLocal(
  numero: string,
  apelido: string,
): Promise<Cartao> {
  const numeroLimpo = normalizarNumeroCartao(numero);

  if (numeroLimpo.length < 8 || numeroLimpo.length > 20) {
    throw new Error("Informe um número de cartão entre 8 e 20 dígitos.");
  }

  const existentes = await listarCartoesLocais();
  const todos = [...CARTOES_DEMO, ...existentes];

  const duplicado = todos.some(
    (cartao) => normalizarNumeroCartao(cartao.numero) === numeroLimpo,
  );

  if (duplicado) {
    throw new Error("Este cartão já está cadastrado.");
  }

  const novoCartao: Cartao = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nome: apelido.trim().slice(0, 40) || "Meu cartão",
    numero: numeroLimpo,
    cor: "#087DDD",
    buiHabilitado: false,
    saldoDemonstrativo: 0,
  };

  await AsyncStorage.setItem(
    CHAVE_CARTOES,
    JSON.stringify([...existentes, novoCartao]),
  );

  return novoCartao;
}

export async function excluirCartaoLocal(id: string): Promise<void> {
  if (!id.startsWith("local-")) {
    throw new Error("Este cartão não pode ser excluído.");
  }

  const cartoes = await listarCartoesLocais();

  const existe = cartoes.some((cartao) => cartao.id === id);

  if (!existe) {
    throw new Error("Cartão não encontrado.");
  }

  const atualizados = cartoes.filter((cartao) => cartao.id !== id);

  await AsyncStorage.setItem(CHAVE_CARTOES, JSON.stringify(atualizados));
}
