export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    code: string;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface ProductFormData {
    name: string;
    category: string;
    price: string;
    quantity: string;
    code: string;
  }