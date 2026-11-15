import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { sincronizarRecargasEmSegundoPlano } from '@/services/historico-recargas';

export default function RootLayout() {
  useEffect(() => {
    void sincronizarRecargasEmSegundoPlano();
    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') void sincronizarRecargasEmSegundoPlano();
    });
    return () => assinatura.remove();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
