import { Product } from '../features/products/types';
import productsData from '../../data/products.json';

// Simulate network delay for realistic behavior
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Fetch all products from mock API
 */
export const fetchProducts = async (): Promise<Product[]> => {
  await delay(500); // Simulate network delay

  return productsData.products;
};

/**
 * Fetch single product by ID
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
  await delay(400);
  
  const product = productsData.products.find(p => p.id === id);
  return product || null;
};

