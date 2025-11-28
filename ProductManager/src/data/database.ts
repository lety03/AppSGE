import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

const PRODUCTS_KEY = '@products';

export const ProductDatabase = {
  async saveProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      const products = await this.getProducts();
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      products.push(newProduct);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      throw error;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const productsJSON = await AsyncStorage.getItem(PRODUCTS_KEY);
      return productsJSON ? JSON.parse(productsJSON) : [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const products = await this.getProducts();
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter((product: Product) =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.code.toLowerCase().includes(term)
    );
  },

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter((p: Product) => p.id !== productId);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(filteredProducts));
      return true;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },

  async updateProduct(updatedProduct: Product): Promise<Product | null> {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p: Product) => p.id === updatedProduct.id);
      
      if (index !== -1) {
        products[index] = {
          ...updatedProduct,
          updatedAt: new Date().toISOString()
        };
        await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        return products[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }
};