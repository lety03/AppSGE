import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ProductDatabase } from '../src/data/database';
import ProductForm from '../src/components/ProductForm';
import ProductList from '../src/components/ProductList';
import SearchBar from '../src/components/SearchBar';
import { Product } from '../src/types/product';

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const loadProducts = async (): Promise<void> => {
    const allProducts = await ProductDatabase.getProducts();
    setProducts(allProducts);
  };

  const filterProducts = async (): Promise<void> => {
    if (searchTerm) {
      const filtered = await ProductDatabase.searchProducts(searchTerm);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<void> => {
    try {
      if (editingProduct) {
        await ProductDatabase.updateProduct({
          ...editingProduct,
          ...productData
        });
        setEditingProduct(null);
      } else {
        await ProductDatabase.saveProduct(productData);
      }
      await loadProducts();
      Alert.alert('Sucesso!', 'Produto salvo com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto');
    }
  };

  const handleDeleteProduct = (productId: string): void => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async (): Promise<void> => {
            await ProductDatabase.deleteProduct(productId);
            await loadProducts();
          }
        }
      ]
    );
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product);
  };

  return (
    <View style={styles.container}>
      <ProductForm 
        onSubmit={handleSaveProduct}
        editingProduct={editingProduct}
        onCancel={() => setEditingProduct(null)}
      />
      
      <SearchBar 
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar produtos..."
      />

      <ProductList 
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});
