/** Dados fictícios usados na demonstração acadêmica da P2. */
export type Cartao = {
  id: string;
  nome: string;
  numero: string;
  cor: string;
  buiHabilitado: boolean;
  saldoDemonstrativo: number;
};

export const CARTOES_DEMO: readonly Cartao[] = [
  {
    id: 'digital',
    nome: 'Cartão Digital',
    numero: '01.07.03372871-7',
    cor: '#148bd2',
    buiHabilitado: false,
    saldoDemonstrativo: 42.50,
  },
  {
    id: 'pessoal',
    nome: 'Eu',
    numero: '01.09.14194806-1',
    cor: '#e52a91',
    buiHabilitado: true,
    saldoDemonstrativo: 18.75,
  },
];
