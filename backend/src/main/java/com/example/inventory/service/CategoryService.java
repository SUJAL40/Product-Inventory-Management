package com.example.inventory.service;

import com.example.inventory.dto.CategoryDto;
import com.example.inventory.entity.Category;
import com.example.inventory.exception.ResourceNotFoundException;
import com.example.inventory.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        List<Object[]> rows = categoryRepository.findCategoriesWithProductCount();
        return rows.stream().map(row -> {
            Long id = (Long) row[0];
            String name = (String) row[1];
            String description = (String) row[2];
            Long count = (Long) row[3];
            return new CategoryDto(id, name, description, count);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        long count = category.getProducts() != null ? category.getProducts().size() : 0;
        return new CategoryDto(category.getId(), category.getName(), category.getDescription(), count);
    }

    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new IllegalStateException("A category with name '" + dto.getName() + "' already exists");
        }
        Category category = new Category();
        category.setName(dto.getName().trim());
        category.setDescription(dto.getDescription());
        Category saved = categoryRepository.save(category);
        return new CategoryDto(saved.getId(), saved.getName(), saved.getDescription(), 0L);
    }

    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(dto.getName().trim(), id)) {
            throw new IllegalStateException("A category with name '" + dto.getName() + "' already exists");
        }

        category.setName(dto.getName().trim());
        category.setDescription(dto.getDescription());
        Category updated = categoryRepository.save(category);
        long count = updated.getProducts() != null ? updated.getProducts().size() : 0;
        return new CategoryDto(updated.getId(), updated.getName(), updated.getDescription(), count);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new IllegalStateException("Cannot delete category because it contains " + category.getProducts().size() + " product(s). Reassign or delete products first.");
        }
        categoryRepository.delete(category);
    }
}
