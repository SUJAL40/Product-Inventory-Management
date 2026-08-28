import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product: Product | null = null;
  loading = true;
  stockAdjustmentAmount = 1;
  adjusting = false;
  deleting = false;
  showDeleteModal = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Failed to load product details');
        this.router.navigate(['/products']);
      }
    });
  }

  adjustStock(delta: number): void {
    if (!this.product) return;
    if (this.product.quantity + delta < 0) {
      this.notificationService.warning('Stock cannot be reduced below 0');
      return;
    }

    this.adjusting = true;
    this.productService.adjustStock(this.product.id, delta).subscribe({
      next: (updated) => {
        this.product = updated;
        this.notificationService.success(`Stock updated: ${updated.quantity} in inventory`);
        this.adjusting = false;
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Error updating stock');
        this.adjusting = false;
      }
    });
  }

  deleteProduct(): void {
    if (!this.product) return;
    this.deleting = true;

    this.productService.deleteProduct(this.product.id).subscribe({
      next: () => {
        this.notificationService.success(`Product "${this.product?.name}" deleted successfully`);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Failed to delete product');
        this.deleting = false;
      }
    });
  }
}
