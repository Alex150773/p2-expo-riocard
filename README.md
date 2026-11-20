# P2 - Aplicativo inspirado no Riocard

Projeto acadêmico da disciplina de Desenvolvimento de Aplicativos Híbridos, desenvolvido com React Native, Expo e TypeScript.

O aplicativo simula funcionalidades de cartões de transporte, recargas e serviços, com armazenamento local e integração com uma API REST demonstrativa.

**Aviso:** este projeto é exclusivamente acadêmico e não possui vínculo oficial com a Riocard. Os cartões, saldos, benefícios e recargas são demonstrativos. Não existem pagamentos reais.

## Funcionalidades

- Tela inicial com navegação entre as principais áreas.
- Consulta, cadastro e exclusão de cartões locais.
- Visualização de detalhes, saldo demonstrativo e bloqueio temporário de cartões.
- Seleção de cartões e recargas com valores predefinidos ou personalizados.
- Confirmação e histórico de recargas simuladas.
- Meus Pedidos com histórico de recargas e detalhes expansíveis.
- Clube Riocard com benefícios fictícios e informações demonstrativas.
- Valida Mais com seleção de cartão e simulação de validação.
- Cartão Digital demonstrativo com identificação mascarada, saldo e seleção de cartões.
- Perfil com edição de nome e e-mail.
- Serviços com busca e dados demonstrativos.
- Armazenamento local com AsyncStorage.
- Comunicação com API REST simulada pelo JSON Server.
- Funcionamento demonstrativo quando a API está indisponível.
- Sincronização de recargas pendentes.

## Tecnologias

- React Native
- Expo SDK 57 e Expo Router
- TypeScript
- JSON Server
- AsyncStorage
- Node.js
- Git e GitHub

Não é necessário instalar MySQL ou PostgreSQL. O JSON Server utiliza o arquivo `api/db.json` como base de dados demonstrativa.

## Requisitos

No computador:

- Node.js e npm instalados.
- Git instalado.
- VS Code ou outro editor de código.
- Computador e celular conectados à mesma rede Wi-Fi.

No celular Android:

- Aplicativo Expo Go compatível com Expo SDK 57.

**Importante:** versões do Expo Go destinadas exclusivamente ao SDK 58 podem apresentar incompatibilidade com este projeto. Utilize uma versão compatível com o SDK 57.

## Instalação

Abra um terminal no computador e execute:

```powershell
git clone https://github.com/Alex150773/p2-expo-riocard.git
cd p2-expo-riocard
npm install
npm --prefix api install
```

## Como executar

Com o computador e o celular na mesma rede Wi-Fi, abra o terminal na pasta principal do projeto e execute:

```powershell
npm run dev
```

Esse comando realiza automaticamente três etapas:

1. Identifica o endereço IPv4 local do computador e atualiza a configuração da API.
2. Inicia o JSON Server, normalmente na porta 3001.
3. Inicia o Expo para executar o aplicativo.

Quando o QR Code aparecer no terminal, abra o Expo Go no Android e faça a leitura para acessar o aplicativo.

Não é necessário configurar manualmente o IP a cada mudança de rede, desde que o script consiga identificar corretamente o endereço local.

Para encerrar a execução, pressione `Ctrl + C` no terminal.

## API e armazenamento

O projeto utiliza duas formas de armazenamento:

**JSON Server:** simula uma API REST utilizando o arquivo `api/db.json`, permitindo consultar e registrar informações demonstrativas.

**AsyncStorage:** mantém informações locais no dispositivo, incluindo dados utilizados pelo aplicativo e recargas pendentes de sincronização.

Quando a API está indisponível, determinadas funcionalidades continuam operando com dados locais. As recargas pendentes podem ser sincronizadas posteriormente, conforme o fluxo implementado.

## Observações

- O aplicativo foi desenvolvido para fins educacionais.
- Não utiliza cartões de transporte reais.
- Não realiza pagamentos ou recargas financeiras.
- A validação de cartões é apenas uma simulação.
- Algumas informações são fictícias para demonstrar as funcionalidades.
- O funcionamento da API no celular depende da conexão de rede entre os dispositivos.

## Repositório

https://github.com/Alex150773/p2-expo-riocard.git
