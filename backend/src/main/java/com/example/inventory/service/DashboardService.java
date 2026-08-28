package com.example.inventory.service;

import com.example.inventory.dto.DashboardStatsDto;
import com.example.inventory.repository.CategoryRepository;
import com.example.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DashboardService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalProducts(productRepository.count());
        stats.setTotalCategories(categoryRepository.count());
        stats.setInStockCount(productRepository.countInStock());
        stats.setLowStockCount(productRepository.countLowStock());
        stats.setOutOfStockCount(productRepository.countOutOfStock());

        BigDecimal totalVal = productRepository.calculateTotalInventoryValue();
        stats.setTotalInventoryValue(totalVal != null ? totalVal : BigDecimal.ZERO);

        Map<String, Long> categoryMap = new LinkedHashMap<>();
        List<Object[]> categoryCounts = productRepository.countProductsGroupedByCategory();
        for (Object[] row : categoryCounts) {
            String catName = (String) row[0];
            Long count = (Long) row[1];
            if (catName != null) {
                categoryMap.put(catName, count);
            }
        }
        stats.setProductsPerCategory(categoryMap);

        return stats;
    }
}
