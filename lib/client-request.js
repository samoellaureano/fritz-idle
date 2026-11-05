export async function gameRequest(path, options) {
  const response = await fetch(path, { ...options, cache: 'no-store' });
  if (response.status === 401) {
    window.location.replace('/login');
    throw new Error('Sua sessão terminou. Entre novamente para continuar.');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a ação.');
  return data;
}
