import { useCallback, useEffect, useState } from 'react';
import { CARTOES_DEMO, type Cartao } from '@/data/cartoes';
import { listarCartoesApi } from '@/services/api';

function validarCartoes(valor: unknown): Cartao[] {
  if (!Array.isArray(valor) || !valor.every((item) =>
    item && typeof item.id === 'string' && typeof item.nome === 'string' &&
    typeof item.numero === 'string' && typeof item.cor === 'string' &&
    typeof item.buiHabilitado === 'boolean' &&
    typeof item.saldoDemonstrativo === 'number' && Number.isFinite(item.saldoDemonstrativo)
  )) throw new Error('A API retornou cartões em formato inválido.');
  return valor as Cartao[];
}

/** Usa a API quando disponível; mantém cartões fictícios se a API falhar. */
export function useCartoes() {
  const [cartoes, setCartoes] = useState<Cartao[]>([...CARTOES_DEMO]);
  const [origem, setOrigem] = useState<'local' | 'api'>('local');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const atualizar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = validarCartoes(await listarCartoesApi());
      setCartoes(dados);
      setOrigem('api');
      setErro(null);
    } catch (falha) {
      setCartoes([...CARTOES_DEMO]);
      setOrigem('local');
      setErro(falha instanceof Error ? falha.message : 'Não foi possível consultar a API.');
    } finally {
      setCarregando(false);
    }
  }, []);
  useEffect(() => { void atualizar(); }, [atualizar]);
  return { cartoes, origem, carregando, erro, atualizar };
}
