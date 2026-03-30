package com.example.demo.dto;

public class CategoryValueDTO {
    private String category;
    private double totalValue;

    public CategoryValueDTO(String category, double totalValue) {
        this.category = category;
        this.totalValue = totalValue;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(double totalValue) {
        this.totalValue = totalValue;
    }
}
