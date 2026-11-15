# P2 - Aplicativo inspirado no Riocard

Projeto acadêmico da disciplina de **Desenvolvimento de Aplicativos Híbridos**, desenvolvido com React Native, Expo e TypeScript. A P2 amplia as telas da P1 com navegação funcional, dados demonstrativos, uma API REST simulada e armazenamento local.

> **Projeto exclusivamente acadêmico.** Não é um aplicativo oficial da Riocard. Cartões, saldos e recargas são demonstrativos. Não há cobrança ou movimentação financeira real.

## Funcionalidades implementadas até o commit `7651130`

- Tela inicial e navegação entre as áreas do aplicativo.
- Listagem de cartões e tela de detalhes, com visualização de saldo demonstrativo.
- Seleção de cartão e valor para realizar recarga simulada.
- Confirmação de recarga e histórico local, com armazenamento no celular.
- Consulta de cartões pela API JSON Server, com dados locais alternativos se o servidor estiver indisponível.
- Registro de recargas simuladas na API quando disponível.
- Sincronização automática de recargas locais pendentes enquanto o aplicativo estiver aberto e houver oportunidade de comunicação com o servidor.
- Telas de Serviços e Perfil, com funcionalidades ainda sujeitas a ampliação na continuidade da P2.

**Atenção:** nem todos os itens visuais representam serviços reais. O projeto continuará recebendo funcionalidades e melhorias antes da entrega final.

## Tecnologias utilizadas

- React Native e Expo
- TypeScript e Expo Router
- JSON Server (API REST simulada)
- Arquivo `api/db.json` (dados de demonstração no servidor)
- AsyncStorage (histórico e dados locais no celular)
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
git clone https://github.com/Alex150773/p2-expo-riocard.git
cd p2-expo-riocard
npm install
cd api
npm install
cd ..
```

Se o projeto já estiver clonado, entre na pasta existente e execute `git pull origin main` antes de instalar ou testar novas alterações, desde que não existam modificações locais pendentes.

## Configurar o endereço da API

Na raiz do projeto, crie um arquivo `.env` a partir do modelo:

```powershell
Copy-Item .env.example .env
ipconfig
```

No resultado do `ipconfig`, identifique o **Endereço IPv4** do computador na rede Wi-Fi. Abra o arquivo `.env` e configure, substituindo o exemplo pelo IP do seu próprio computador:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3001
```

O IP acima é **apenas um exemplo**. Não utilize `localhost` como endereço da API no Expo Go do celular: nesse caso, `localhost` apontaria para o próprio celular. O arquivo `.env` é uma configuração local e não deve ser enviado ao GitHub.

## Executar a API e o aplicativo

No VS Code, abra **dois terminais**, que podem ficar divididos lado a lado.

**Terminal 1 — API:**

```powershell
cd api
npm start
```

A API deverá responder na porta **3001**. No navegador do computador, confira:

- `http://localhost:3001/cartoes`
- `http://localhost:3001/usuarios`
- `http://localhost:3001/servicos`
- `http://localhost:3001/recargas`

**Terminal 2 — aplicativo Expo (na raiz do projeto):**

```powershell
npx expo start --clear
```

Abra o **Expo Go no celular**, leia o QR Code exibido pelo Expo ou selecione o servidor de desenvolvimento identificado como `P2-expo`. Mantenha os dois terminais em execução durante os testes conectados à API.

> Se o computador tiver mudado de rede ou de IP, atualize `.env` e reinicie o Expo para carregar a nova configuração.

## Testar o funcionamento

1. Com a API ligada, abra **Meus cartões** e verifique os cartões demonstrativos.
2. Faça uma recarga **simulada** e consulte `http://localhost:3001/recargas` no navegador do computador para conferir o registro no servidor.
3. Desligue **somente a API** com `Ctrl + C`, mantendo o Expo aberto.
4. Faça outra recarga simulada e confira se ela permanece no histórico do celular.
5. Inicie a API novamente, volte ao aplicativo e verifique se a recarga pendente é enviada sem criar duplicatas.

A sincronização automática depende de o aplicativo estar em execução e conseguir se comunicar com a API. Não há garantia de sincronização enquanto o aplicativo estiver completamente fechado.

**Observação:** os dados demonstrativos da API ficam no arquivo `api/db.json`; os dados locais ficam no armazenamento do aparelho. As recargas são apenas simulações e não alteram saldos reais.

## Verificar o código

Na raiz do projeto:

```powershell
npx tsc --noEmit
```

O comando deve terminar sem erros de TypeScript.

## Organização principal

```text
p2-expo-riocard/
├── api/
│   ├── db.json                 # Dados demonstrativos da API
│   └── package.json           # Comandos e dependências do JSON Server
├── src/
│   ├── app/                   # Telas e rotas do aplicativo
│   ├── data/                  # Dados locais demonstrativos
│   ├── hooks/                 # Lógica reutilizável das telas
│   └── services/              # Comunicação HTTP e histórico de recargas
├── .env.example               # Modelo de configuração da API
├── package.json
└── README.md
```

## Trabalho em equipe e continuidade

A estrutura inicial, a API e as integrações demonstrativas foram desenvolvidas na primeira etapa. A segunda etapa incluirá novas telas, melhorias de navegação e complementação das funcionalidades por **Deyvison**, com commits próprios no GitHub.

Antes de começar a desenvolver, o próximo integrante deve atualizar a cópia local do repositório, executar os testes existentes e trabalhar em alterações pequenas e verificáveis. Após implementar as novas funcionalidades, deverá **atualizar este README**, descrevendo o que foi realmente concluído e como testar.

## Integrantes

- Alexander Guido
- Deyvison Fonseca

## Entrega acadêmica

O código-fonte e o histórico de commits ficam disponíveis no repositório informado acima. Os materiais adicionais exigidos pelo professor deverão ser enviados pelo espaço de entrega da Universidade, conforme o enunciado da atividade.
