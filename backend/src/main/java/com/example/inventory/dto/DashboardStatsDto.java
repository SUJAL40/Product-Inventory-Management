package com.example.inventory.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStatsDto {

    private long totalProducts;
    private long totalCategories;
    private long inStockCount;
    private long lowStockCount;
    private long outOfStockCount;
    private BigDecimal totalInventoryValue;
    private Map<String, Long> productsPerCategory;

    public DashboardStatsDto() {
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getInStockCount() {
        return inStockCount;
    }

    public void setInStockCount(long inStockCount) {
        this.inStockCount = inStockCount;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getOutOfStockCount() {
        return outOfStockCount;
    }

    public void setOutOfStockCount(long outOfStockCount) {
        this.outOfStockCount = outOfStockCount;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public Map<String, Long> getProductsPerCategory() {
        return productsPerCategory;
    }

    public void setProductsPerCategory(Map<String, Long> productsPerCategory) {
        this.productsPerCategory = productsPerCategory;
    }
}
