import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProductDatabase } from '../src/data/database';
import { Product } from '../src/types/product';

interface CategoryCount {
  name: string;
  count: number;
}

interface ReportData {
  totalProducts: number;
  totalValue: number;
  categories: CategoryCount[];
  lowStock: Product[];
}

export default function ReportScreen() {
  const [reportData, setReportData] = useState<ReportData>({
    totalProducts: 0,
    totalValue: 0,
    categories: [],
    lowStock: []
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async (): Promise<void> => {
    const products = await ProductDatabase.getProducts();
    
    const totalValue = products.reduce((sum: number, product: Product) => 
      sum + (product.price * product.quantity), 0
    );

    const categories: { [key: string]: number } = {};
    products.forEach((product: Product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });

    const lowStock = products.filter((product: Product) => product.quantity < 10);

    const categoriesArray: CategoryCount[] = Object.keys(categories).map((name: string) => ({ 
      name, 
      count: categories[name] 
    }));

    setReportData({
      totalProducts: products.length,
      totalValue,
      categories: categoriesArray,
      lowStock
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Geral</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total de Produtos</Text>
          <Text style={styles.cardValue}>{reportData.totalProducts}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Valor Total em Estoque</Text>
          <Text style={styles.cardValue}>R$ {reportData.totalValue.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produtos com Baixo Estoque</Text>
        {reportData.lowStock.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum produto com baixo estoque</Text>
        ) : (
          reportData.lowStock.map((product: Product) => (
            <View key={product.id} style={styles.lowStockItem}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.stockAlert}>Estoque: {product.quantity}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produtos por Categoria</Text>
        {reportData.categories.map((category: CategoryCount) => (
          <View key={category.name} style={styles.categoryItem}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryCount}>{category.count} produtos</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  lowStockItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockAlert: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  categoryItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryCount: {
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});