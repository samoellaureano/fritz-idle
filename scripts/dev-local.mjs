import { spawn } from 'node:child_process';
import { join } from 'node:path';

console.log('Modo local: Fritz_Teste começa do zero. Progresso, perfil e mural ficam somente em memória.');
console.log('Acesse http://localhost:3001/login e use "Entrar como Fritz_Teste". Reiniciar o servidor descarta os dados.');
const child = spawn(process.execPath, [join('node_modules', 'next', 'dist', 'bin', 'next'), 'dev', '--hostname', '127.0.0.1', '--port', '3001'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development', FRITZ_LOCAL_MEMORY: '1', SITE_URL: 'http://localhost:3001',
    NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '', SUPABASE_SERVICE_ROLE_KEY: '' },
});
child.on('error', (error) => { console.error('Falha ao iniciar o servidor local:', error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
