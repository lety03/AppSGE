import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href="/products" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📦 Cadastro de Produtos</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/reports" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📊 Relatórios</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});