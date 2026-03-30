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

import org.springframework.security.core.Authentication;
import com.example.demo.security.CustomUserDetails;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<DashboardMetricsDTO> getDashboardAnalytics(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();
        long totalProducts = productRepository.countByUserId(userId);
        double totalInventoryValue = productService.calculateInventoryValue(userId);
        List<CategoryValueDTO> categoryInventory = productRepository.findCategoryInventoryValuesByUserId(userId);

        DashboardMetricsDTO dashboardData = new DashboardMetricsDTO(totalProducts, totalInventoryValue,
                categoryInventory);
        return ResponseEntity.ok(dashboardData);
    }

    @GetMapping("/total-inventory-value")
    public ResponseEntity<Map<String, Double>> getTotalInventoryValue(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        double totalValue = productService.calculateInventoryValue(userDetails.getId());
        Map<String, Double> response = new HashMap<>();
        response.put("totalInventoryValue", totalValue);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category-inventory-value")
    public ResponseEntity<List<CategoryValueDTO>> getCategoryInventoryValue(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<CategoryValueDTO> categoryValues = productRepository.findCategoryInventoryValuesByUserId(userDetails.getId());
        return ResponseEntity.ok(categoryValues);
    }
}
