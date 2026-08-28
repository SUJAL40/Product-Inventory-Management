import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  viewMode: 'table' | 'grid' = 'table';

  // Filters
  searchTerm = '';
  selectedCategoryId: number | null = null;
  selectedStatus: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'ALL';
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'quantity-asc' | 'quantity-desc' = 'name';

  // Delete modal state
  productToDelete: Product | null = null;
  deleting = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategoryId = +params['category'];
      }
      this.loadCategories();
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.notificationService.error('Failed to load categories');
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.searchTerm, this.selectedCategoryId || undefined).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.error('Failed to fetch products');
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  get filteredProducts(): Product[] {
    let list = this.products;

    if (this.selectedStatus !== 'ALL') {
      list = list.filter(p => p.stockStatus === this.selectedStatus);
    }

    return list.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'quantity-asc': return a.quantity - b.quantity;
        case 'quantity-desc': return b.quantity - a.quantity;
        default: return a.name.localeCompare(b.name);
      }
    });
  }

  adjustStock(product: Product, delta: number, event: Event): void {
    event.stopPropagation();
    if (product.quantity + delta < 0) return;

    this.productService.adjustStock(product.id, delta).subscribe({
      next: (updated) => {
        product.quantity = updated.quantity;
        product.stockStatus = updated.stockStatus;
        this.notificationService.success(`Updated stock for "${product.name}" (${updated.quantity} remaining)`);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Error updating stock');
      }
    });
  }

  confirmDelete(product: Product, event: Event): void {
    event.stopPropagation();
    this.productToDelete = product;
  }

  cancelDelete(): void {
    this.productToDelete = null;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;
    this.deleting = true;

    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== this.productToDelete?.id);
        this.notificationService.success(`Product "${this.productToDelete?.name}" deleted`);
        this.productToDelete = null;
        this.deleting = false;
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Failed to delete product');
        this.deleting = false;
      }
    });
  }
}
