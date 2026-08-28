export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  quantity: number;
  minStockLevel: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  sku: string;
  description?: string;
  price: number;
  quantity: number;
  minStockLevel?: number;
  imageUrl?: string;
  categoryId: number;
}
