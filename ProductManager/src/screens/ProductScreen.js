import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { ProductDatabase } from '../data/database';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(function() {
    loadProducts();
  }, []);

  useEffect(function() {
    filterProducts();
  }, [searchTerm, products]);

  const loadProducts = async function() {
    const allProducts = await ProductDatabase.getProducts();
    setProducts(allProducts);
  };

  const filterProducts = async function() {
    if (searchTerm) {
      const filtered = await ProductDatabase.searchProducts(searchTerm);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSaveProduct = async function(productData) {
    try {
      if (editingProduct) {
        await ProductDatabase.updateProduct({
          id: editingProduct.id,
          name: productData.name,
          category: productData.category,
          price: productData.price,
          quantity: productData.quantity,
          code: productData.code,
          createdAt: editingProduct.createdAt
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

  const handleDeleteProduct = function(productId) {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async function() {
            await ProductDatabase.deleteProduct(productId);
            await loadProducts();
          }
        }
      ]
    );
  };

  const handleEditProduct = function(product) {
    setEditingProduct(product);
  };

  return (
    <View style={styles.container}>
      <ProductForm 
        onSubmit={handleSaveProduct}
        editingProduct={editingProduct}
        onCancel={function() { setEditingProduct(null); }}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default ProductScreen;