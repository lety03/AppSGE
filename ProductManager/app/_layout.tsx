import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Gerenciador de Produtos',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="products" 
        options={{ 
          title: 'Cadastro de Produtos',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="reports" 
        options={{ 
          title: 'Relatórios',
          headerShown: true
        }} 
      />
    </Stack>
  );
}