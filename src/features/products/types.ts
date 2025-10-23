export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images: string[];
  description: string;
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];
  cachedAt: number | null;
}

