package com.example.demo.dto;

import java.util.List;

public class DashboardMetricsDTO {
    private long totalProducts;
    private double totalInventoryValue;
    private List<CategoryValueDTO> categoryInventory;

    public DashboardMetricsDTO(long totalProducts, double totalInventoryValue,
            List<CategoryValueDTO> categoryInventory) {
        this.totalProducts = totalProducts;
        this.totalInventoryValue = totalInventoryValue;
        this.categoryInventory = categoryInventory;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public double getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(double totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public List<CategoryValueDTO> getCategoryInventory() {
        return categoryInventory;
    }

    public void setCategoryInventory(List<CategoryValueDTO> categoryInventory) {
        this.categoryInventory = categoryInventory;
    }
}
