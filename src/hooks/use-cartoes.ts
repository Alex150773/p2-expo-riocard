import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { CARTOES_DEMO, type Cartao } from "@/data/cartoes";
import { listarCartoesApi } from "@/services/api";
import { listarCartoesLocais } from "@/services/cartoes-locais";

function validarCartoes(valor: unknown): Cartao[] {
  if (
    !Array.isArray(valor) ||
    !valor.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.nome === "string" &&
        typeof item.numero === "string" &&
        typeof item.cor === "string" &&
        typeof item.buiHabilitado === "boolean" &&
        typeof item.saldoDemonstrativo === "number" &&
        Number.isFinite(item.saldoDemonstrativo),
    )
  ) {
    throw new Error("A API retornou cartões em formato inválido.");
  }

  return valor as Cartao[];
}

export function useCartoes() {
  const [cartoes, setCartoes] = useState<Cartao[]>([...CARTOES_DEMO]);
  const [origem, setOrigem] = useState<"local" | "api">("local");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const atualizar = useCallback(async () => {
    setCarregando(true);

    try {
      let cartoesBase: Cartao[] = [...CARTOES_DEMO];
      let origemAtual: "local" | "api" = "local";

      try {
        cartoesBase = validarCartoes(await listarCartoesApi());
        origemAtual = "api";
      } catch {
        // Mantém os cartões demonstrativos se a API estiver indisponível.
      }

      const cartoesSalvos = await listarCartoesLocais();

      const todos = [...cartoesBase];

      for (const cartao of cartoesSalvos) {
        const existe = todos.some((item) => item.id === cartao.id);

        if (!existe) {
          todos.push(cartao);
        }
      }

      setCartoes(todos);
      setOrigem(origemAtual);
      setErro(null);
    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível carregar os cartões.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void atualizar();
    }, [atualizar]),
  );

  return {
    cartoes,
    origem,
    carregando,
    erro,
    atualizar,
  };
}
