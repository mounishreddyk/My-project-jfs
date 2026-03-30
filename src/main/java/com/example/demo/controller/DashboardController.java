package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CategoryValueDTO;
import com.example.demo.dto.DashboardMetricsDTO;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<DashboardMetricsDTO> getDashboardAnalytics() {
        long totalProducts = productRepository.count();
        double totalInventoryValue = productService.calculateInventoryValue();
        List<CategoryValueDTO> categoryInventory = productRepository.findCategoryInventoryValues();

        DashboardMetricsDTO dashboardData = new DashboardMetricsDTO(totalProducts, totalInventoryValue,
                categoryInventory);
        return ResponseEntity.ok(dashboardData);
    }

    @GetMapping("/total-inventory-value")
    public ResponseEntity<Map<String, Double>> getTotalInventoryValue() {
        double totalValue = productService.calculateInventoryValue();
        Map<String, Double> response = new HashMap<>();
        response.put("totalInventoryValue", totalValue);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category-inventory-value")
    public ResponseEntity<List<CategoryValueDTO>> getCategoryInventoryValue() {
        List<CategoryValueDTO> categoryValues = productRepository.findCategoryInventoryValues();
        return ResponseEntity.ok(categoryValues);
    }
}
