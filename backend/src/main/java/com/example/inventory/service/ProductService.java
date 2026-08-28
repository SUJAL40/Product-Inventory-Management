package com.example.inventory.service;

import com.example.inventory.dto.ProductRequestDto;
import com.example.inventory.dto.ProductResponseDto;
import com.example.inventory.entity.Category;
import com.example.inventory.entity.Product;
import com.example.inventory.exception.ResourceNotFoundException;
import com.example.inventory.repository.CategoryRepository;
import com.example.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts(String search, Long categoryId) {
        String trimmedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        List<Product> products = productRepository.searchProducts(trimmedSearch, categoryId);
        return products.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponseDto(product);
    }

    public ProductResponseDto createProduct(ProductRequestDto dto) {
        if (productRepository.existsBySkuIgnoreCase(dto.getSku().trim())) {
            throw new IllegalStateException("A product with SKU '" + dto.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Product product = new Product();
        mapRequestToEntity(dto, product, category);

        Product saved = productRepository.save(product);
        return mapToResponseDto(saved);
    }

    public ProductResponseDto updateProduct(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (productRepository.existsBySkuIgnoreCaseAndIdNot(dto.getSku().trim(), id)) {
            throw new IllegalStateException("A product with SKU '" + dto.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        mapRequestToEntity(dto, product, category);

        Product updated = productRepository.save(product);
        return mapToResponseDto(updated);
    }

    public ProductResponseDto adjustStock(Long id, int quantityDelta) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        int newQuantity = product.getQuantity() + quantityDelta;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Cannot reduce stock below 0. Current stock: " + product.getQuantity());
        }
        product.setQuantity(newQuantity);
        Product saved = productRepository.save(product);
        return mapToResponseDto(saved);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private void mapRequestToEntity(ProductRequestDto dto, Product product, Category category) {
        product.setName(dto.getName().trim());
        product.setSku(dto.getSku().trim().toUpperCase());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setMinStockLevel(dto.getMinStockLevel() != null ? dto.getMinStockLevel() : 5);
        product.setImageUrl(dto.getImageUrl());
        product.setCategory(category);
    }

    public ProductResponseDto mapToResponseDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setMinStockLevel(product.getMinStockLevel());
        dto.setStockStatus(product.getStockStatus());
        dto.setImageUrl(product.getImageUrl());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
}
