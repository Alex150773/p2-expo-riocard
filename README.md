
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
git clone https://github.com/Alex150773/p2-expo-riocard.git
cd p2-expo-riocard
npm install
npm --prefix api install
```

## Execução

Conecte o computador e o celular Android à mesma rede Wi-Fi.

Execute na pasta principal:

```powershell
npm run dev
```

Esse comando identifica automaticamente o IPv4 do computador, configura a URL da API no arquivo `.env` e inicia o JSON Server e o Expo.

Abra o aplicativo usando o QR Code exibido no terminal.

**Importante:** utilize uma versão do Expo Go compatível com o **Expo SDK 57**. Uma versão compatível apenas com o SDK 58 pode apresentar erro ao abrir este projeto.

Se houver mais de uma interface de rede ativa, a identificação automática poderá solicitar uma verificação manual.

## Observações

- A API utiliza a porta `3001`.
- O computador deve permanecer ligado enquanto o aplicativo utiliza a API local.
- O arquivo `.env` é gerado ou atualizado automaticamente e não deve ser enviado ao GitHub.
- Os dados de demonstração não representam cartões ou operações reais.

## Repositório

https://github.com/Alex150773/p2-expo-riocard
