import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Product } from '../types/product';

interface ProductFormProps {
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  editingProduct: Product | null;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, editingProduct, onCancel }) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price.toString());
      setQuantity(editingProduct.quantity.toString());
      setCode(editingProduct.code);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = (): void => {
    setName('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setCode('');
  };

  const handleSubmit = (): void => {
    if (!name || !category || !price || !quantity || !code) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    onSubmit({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      code,
    });

    if (!editingProduct) {
      resetForm();
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>
        {editingProduct ? 'Editar Produto' : 'Novo Produto'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Código"
        value={code}
        onChangeText={setCode}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        {editingProduct && (
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {editingProduct ? 'Atualizar' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductForm;