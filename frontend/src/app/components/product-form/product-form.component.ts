import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { Category } from '../../models/category.model';
import { ProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProductData(this.productId);
      }
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      categoryId: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [5, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      description: ['', [Validators.maxLength(1000)]]
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

  loadProductData(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          categoryId: product.categoryId,
          price: product.price,
          quantity: product.quantity,
          minStockLevel: product.minStockLevel,
          imageUrl: product.imageUrl || '',
          description: product.description || ''
        });
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Product not found');
        this.router.navigate(['/products']);
      }
    });
  }

  generateSku(): void {
    const name = this.productForm.get('name')?.value || 'ITEM';
    const cleanPrefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.productForm.patchValue({
      sku: `${cleanPrefix}-${randomNum}`
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.productForm.value;
    const productData: ProductRequest = {
      name: formValue.name,
      sku: formValue.sku.toUpperCase(),
      categoryId: +formValue.categoryId,
      price: +formValue.price,
      quantity: +formValue.quantity,
      minStockLevel: +formValue.minStockLevel,
      imageUrl: formValue.imageUrl || null,
      description: formValue.description || null
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.notificationService.success('Product updated successfully!');
          this.router.navigate(['/products', this.productId]);
        },
        error: (err) => {
          this.notificationService.error(err.error?.message || 'Failed to update product');
          this.submitting = false;
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: (created) => {
          this.notificationService.success('Product added successfully!');
          this.router.navigate(['/products', created.id]);
        },
        error: (err) => {
          this.notificationService.error(err.error?.message || 'Failed to create product');
          this.submitting = false;
        }
      });
    }
  }
}
