# P2 - Aplicativo inspirado no Riocard

Projeto acadêmico da disciplina de Desenvolvimento de Aplicativos Híbridos, desenvolvido com React Native, Expo e TypeScript.

O aplicativo simula funcionalidades de cartões de transporte, recargas e serviços.

**Aviso:** projeto exclusivamente acadêmico, sem vínculo oficial com a Riocard. Cartões, saldos e recargas são demonstrativos. Não existem pagamentos reais.

## Funcionalidades

- Tela inicial com navegação entre as principais áreas.
- Consulta, cadastro e exclusão de cartões locais.
- Visualização de detalhes, saldo demonstrativo e bloqueio temporário de cartões.
- Seleção de cartões e recargas com valores predefinidos ou personalizados.
- Confirmação e histórico de recargas simuladas.
- Consulta de **Meus pedidos** com reutilização dos registros de recarga demonstrativos e detalhes expansíveis.
- Tela **Clube Riocard** com lista de benefícios fictícios e consulta de detalhes ilustrativos.
- Simulação local **Valida Mais** com seleção de cartão e retorno visual no aparelho (sem comunicação com validadores reais).
- Visualização de **Cartão Digital** demonstrativo com identificação mascarada, saldo e alternância entre cartões.
- Armazenamento local com AsyncStorage.
- Comunicação com API REST simulada pelo JSON Server.
- Funcionamento demonstrativo quando a API está indisponível.
- Sincronização de recargas pendentes.
- Perfil com edição de nome e e-mail.
- Serviços com busca e dados demonstrativos.

## Tecnologias

- React Native, Expo SDK 57 e Expo Router
- TypeScript
- JSON Server e arquivo `api/db.json`
- AsyncStorage
- Git e GitHub

Não é necessário instalar MySQL ou PostgreSQL.

## Instalação

No computador, instale Node.js e Git.

Clone o repositório:

```powershell
git clone [https://github.com/Alex150773/p2-expo-riocard.git](https://github.com/Alex150773/p2-expo-riocard.git)
cd p2-expo-riocard
npm install
npm --prefix api install
