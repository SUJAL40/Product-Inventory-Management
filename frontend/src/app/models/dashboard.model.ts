export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
  productsPerCategory: { [categoryName: string]: number };
}
