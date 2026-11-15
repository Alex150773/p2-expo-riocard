# P2 - Aplicativo inspirado no Riocard

Projeto acadêmico da disciplina de **Desenvolvimento de Aplicativos Híbridos**, desenvolvido com React Native, Expo e TypeScript. A P2 amplia as telas da P1 com navegação funcional, dados demonstrativos, uma API REST simulada e armazenamento local.

> **Projeto exclusivamente acadêmico.** Não é um aplicativo oficial da Riocard. Cartões, saldos e recargas são demonstrativos. Não há cobrança ou movimentação financeira real.

## Funcionalidades implementadas

### Etapa 1 (até o commit `c716aa9`)
- Tela inicial e navegação entre as áreas do aplicativo.
- Listagem de cartões e tela de detalhes, com visualização de saldo demonstrativo.
- Seleção de cartão e valor para realizar recarga simulada.
- Confirmação de recarga e histórico local, com armazenamento no celular.
- Consulta de cartões pela API JSON Server, com dados locais alternativos se o servidor estiver indisponível.
- Registro de recargas simuladas na API quando disponível.
- Sincronização automática de recargas locais pendentes enquanto o aplicativo estiver aberto e houver oportunidade de comunicação com o servidor.

### Etapa 2 (commits `053d8a5` a `eb73c34` e atualização final)
- Integração da tela de **Perfil** com a API (`/usuarios`), mantendo modo demonstrativo local quando offline.
- Edição de nome e e-mail do usuário na tela de **Perfil**, com persistência local (`AsyncStorage`) e sincronização com a API (`PATCH /usuarios/demo`), além da opção de restaurar os dados padrão.
- Integração da tela de **Serviços** com a API (`/servicos`) para exibição de serviços em destaque com alternativa local.
- Busca em tempo real na tela de **Serviços**, filtrando itens da API e do menu completo sem diferenciação de maiúsculas ou acentos.
- Bloqueio e desbloqueio temporário simulado na tela de **Detalhes do cartão**, persistido no dispositivo, com indicador visual e bloqueio preventivo da opção de recarga.
- Resumo financeiro (quantidade e total acumulado), selo de status por item (sincronizada ou salva localmente), contagem de pendências e botão de sincronização manual no **Histórico de recargas**.

## Tecnologias utilizadas

- React Native e Expo
- TypeScript e Expo Router
- JSON Server (API REST simulada)
- Arquivo `api/db.json` (dados de demonstração no servidor)
- AsyncStorage (histórico, preferências e dados locais no celular)
- HTTP e JSON para comunicação entre aplicativo e API
- Git e GitHub para versionamento

Não é necessário instalar MySQL ou PostgreSQL para executar esta versão do projeto.

## Repositório

https://github.com/Alex150773/p2-expo-riocard

## O que instalar

**No computador:** Node.js, Git e um editor como o VS Code. O Expo e o JSON Server serão executados pelo terminal após instalar as dependências do projeto.

**No celular Android:** apenas o aplicativo **Expo Go**, compatível com a versão do Expo utilizada no projeto. **Não é necessário instalar VS Code, Node.js ou Git no celular.**

Para testar pelo Expo Go usando a rede local, conecte o computador e o celular à mesma rede Wi-Fi.

## Como baixar e instalar

Abra o PowerShell no computador:

```powershell
git clone [https://github.com/Alex150773/p2-expo-riocard.git](https://github.com/Alex150773/p2-expo-riocard.git)
cd p2-expo-riocard
npm install
cd api
npm install
cd ..