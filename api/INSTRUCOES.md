# API simulada da P2

Esta API é usada **somente para demonstração acadêmica**. Todos os dados são fictícios. Não há autenticação real, pagamentos ou integração com serviços da Riocard.

## Iniciar no Windows (PowerShell)

Abra um terminal na raiz do projeto e execute:

```powershell
cd api
npm install
npm start
```

Mantenha esse terminal aberto. Em outro terminal, na raiz do projeto, execute `npx expo start --clear` para iniciar o aplicativo.

## Verificar

Abra no navegador do computador:

- http://localhost:3001/cartoes
- http://localhost:3001/usuarios
- http://localhost:3001/servicos

Ou execute em outro PowerShell:

```powershell
Invoke-RestMethod http://localhost:3001/cartoes
```

Para interromper, pressione `Ctrl + C` no terminal da API.

## Acesso pelo celular

No celular, `localhost` significa **o próprio celular**, não o computador. Quando integrarmos o aplicativo à API, utilizaremos o endereço IP local do computador, configurável, com ambos os dispositivos na mesma rede Wi-Fi. A porta é **3001**. O firewall do Windows pode solicitar permissão para conexões na rede privada.

**Importante:** neste commit a API funciona separadamente. As telas do aplicativo continuam usando os dados locais. A comunicação HTTP será implementada no próximo commit.

## Cuidados

- Não inserir CPF, senha, dados bancários ou informações reais em `db.json`.
- Não publicar a API de demonstração na internet sem proteção.
- A instalação cria `api/node_modules` e `api/package-lock.json`. O `node_modules` não deve entrar no Git. O `package-lock.json` deve ser versionado para reproduzir a instalação.
