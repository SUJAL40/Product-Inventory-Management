import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);

  categories: Category[] = [];
  loading = true;
  categoryForm!: FormGroup;

  // Modal / Editing state
  isModalOpen = false;
  editingCategory: Category | null = null;
  submitting = false;

  // Delete modal state
  categoryToDelete: Category | null = null;
  deleting = false;

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Failed to load categories');
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.editingCategory = null;
    this.categoryForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || ''
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formVal = this.categoryForm.value;
    const categoryData: Category = {
      name: formVal.name.trim(),
      description: formVal.description ? formVal.description.trim() : ''
    };

    if (this.editingCategory && this.editingCategory.id) {
      this.categoryService.updateCategory(this.editingCategory.id, categoryData).subscribe({
        next: (updated) => {
          this.notificationService.success(`Category "${updated.name}" updated`);
          this.closeModal();
          this.loadCategories();
          this.submitting = false;
        },
        error: (err) => {
          this.notificationService.error(err.error?.message || 'Failed to update category');
          this.submitting = false;
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: (created) => {
          this.notificationService.success(`Category "${created.name}" created`);
          this.closeModal();
          this.loadCategories();
          this.submitting = false;
        },
        error: (err) => {
          this.notificationService.error(err.error?.message || 'Failed to create category');
          this.submitting = false;
        }
      });
    }
  }

  confirmDelete(category: Category): void {
    this.categoryToDelete = category;
  }

  cancelDelete(): void {
    this.categoryToDelete = null;
  }

  deleteCategory(): void {
    if (!this.categoryToDelete || !this.categoryToDelete.id) return;
    this.deleting = true;

    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: () => {
        this.notificationService.success(`Category "${this.categoryToDelete?.name}" deleted`);
        this.categoryToDelete = null;
        this.deleting = false;
        this.loadCategories();
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Failed to delete category');
        this.deleting = false;
      }
    });
  }
}
