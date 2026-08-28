import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { DashboardStats } from '../../models/dashboard.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);

  stats: DashboardStats | null = null;
  recentProducts: Product[] = [];
  lowStockProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        this.error = 'Failed to connect to backend server. Make sure Spring Boot is running on port 8081.';
        this.notificationService.error('Error loading dashboard statistics');
        this.loading = false;
      }
    });

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.recentProducts = products.slice(0, 5);
        this.lowStockProducts = products.filter(p => p.stockStatus === 'LOW_STOCK' || p.stockStatus === 'OUT_OF_STOCK');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getCategoryEntries(): { name: string; count: number }[] {
    if (!this.stats?.productsPerCategory) return [];
    return Object.entries(this.stats.productsPerCategory).map(([name, count]) => ({
      name,
      count
    }));
  }

  getCategoryPercentage(count: number): number {
    if (!this.stats || this.stats.totalProducts === 0) return 0;
    return Math.round((count / this.stats.totalProducts) * 100);
  }
}
