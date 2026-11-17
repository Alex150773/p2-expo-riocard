
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const caminhoEnv = path.resolve(__dirname, '..', '.env');
const interfaces = os.networkInterfaces();

const candidatos = [];

for (const [nome, enderecos] of Object.entries(interfaces)) {
  for (const endereco of enderecos || []) {
    if (endereco.family !== 'IPv4' || endereco.internal) {
      continue;
    }

    const ip = endereco.address;

    // Prioriza endereços IPv4 de redes privadas.
    const privado =
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(ip);

    if (!privado) continue;

    // Evita interfaces virtuais comuns.
    const virtual = /virtual|vmware|virtualbox|vbox|wsl|docker|vpn|vethernet|hyper-v|tailscale|zerotier/i.test(nome);

    candidatos.push({
      nome,
      ip,
      prioridade: virtual ? 1 : 0,
    });
  }
}

candidatos.sort((a, b) => a.prioridade - b.prioridade);

if (candidatos.length === 0) {
  console.error('Não foi encontrado um IPv4 privado para a API.');
  console.error('Verifique a conexão de rede do computador.');
  process.exit(1);
}

const escolhido = candidatos[0];

if (
  candidatos.length > 1 &&
  candidatos[0].prioridade === candidatos[1].prioridade
) {
  console.error('Foram encontradas várias interfaces de rede possíveis:');

  for (const candidato of candidatos) {
    console.error(`- ${candidato.nome}: ${candidato.ip}`);
  }

  console.error('Não foi possível escolher o IP com segurança.');
  process.exit(1);
}

const url = `http://${escolhido.ip}:3001`;

const conteudoAnterior = fs.existsSync(caminhoEnv)
  ? fs.readFileSync(caminhoEnv, 'utf8')
  : '';

const linha = `EXPO_PUBLIC_API_URL=${url}`;

const conteudoAtualizado = /^EXPO_PUBLIC_API_URL=.*$/m.test(conteudoAnterior)
  ? conteudoAnterior.replace(/^EXPO_PUBLIC_API_URL=.*$/m, linha)
  : `${conteudoAnterior.trimEnd()}${conteudoAnterior.trim() ? '\n' : ''}${linha}`;

fs.writeFileSync(caminhoEnv, `${conteudoAtualizado.trimEnd()}\n`, 'utf8');

console.log(`Rede selecionada: ${escolhido.nome}`);
console.log(`API configurada: ${url}`);
