package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.model.Product;

@Service
public class AIService {

    @Autowired
    private ProductService productService;

    private final RestTemplate restTemplate = new RestTemplate();

    @org.springframework.beans.factory.annotation.Value("${google.ai.api.key:}")
    private String apiKey;

    public AIService() {
    }

    public String processQuery(String query) {
        if (apiKey == null || apiKey.isEmpty()) {
            return processFallbackQuery(query);
        } else {
            try {
                // Better AI response using context
                List<Product> products = productService.getAllProducts();
                StringBuilder context = new StringBuilder("Current Inventory:\n");
                for (Product p : products) {
                    context.append("- ").append(p.getName())
                            .append(" (Category: ").append(p.getCategory() != null ? p.getCategory().getName() : "None")
                            .append(", Qty: ").append(p.getQuantity())
                            .append(", Price: $").append(p.getPrice())
                            .append(")\n");
                }
                
                String prompt = "You are a helpful AI assistant for an inventory management system. " +
                        "Use the following inventory data to answer the user's query clearly and concisely. " +
                        "If the user asks something unrelated, politely steer them back to inventory.\n\n" +
                        context.toString() + "\n" +
                        "User Query: \"" + query + "\"\n" +
                        "Answer:";
                        
                return callGoogleAI(prompt);
            } catch (Exception e) {
                return "Sorry, I couldn't process your AI query. Error: " + e.getMessage();
            }
        }
    }

    private String processFallbackQuery(String query) {
        String type = "general";
        String product = null;
        String category = null;

        String lowerQuery = query.toLowerCase();
        List<Product> products = productService.getAllProducts();

        if (lowerQuery.contains("value") || lowerQuery.contains("total")) {
            if (lowerQuery.contains("inventory") || lowerQuery.contains("all")) {
                double total = products.stream().mapToDouble(p -> p.getPrice() * p.getQuantity()).sum();
                return "Total inventory value: $" + total;
            }

            type = "total_value_category";
            List<String> validCategories = products.stream()
                    .map(p -> p.getCategory() != null ? p.getCategory().getName() : "")
                    .filter(name -> !name.isEmpty())
                    .distinct()
                    .toList();

            for (String cat : validCategories) {
                if (lowerQuery.contains(cat.toLowerCase())) {
                    category = cat;
                    break;
                }
            }

            if (category == null) {
                String[] words = lowerQuery.split(" ");
                category = words[words.length - 1];
                if (!category.isEmpty()) {
                    category = category.substring(0, 1).toUpperCase() + category.substring(1);
                } else {
                    category = "Electronics";
                }
            }
        } else if (lowerQuery.contains("low stock") || lowerQuery.contains("low")) {
            type = "low_stock";
        } else if (lowerQuery.contains("many") || lowerQuery.contains("count")) {
            type = "count_product";
            
            List<String> validProducts = products.stream()
                    .map(Product::getName)
                    .distinct()
                    .toList();

            for (String pName : validProducts) {
                if (lowerQuery.contains(pName.toLowerCase())) {
                    product = pName;
                    break;
                }
            }

            if (product == null) {
                String[] words = lowerQuery.split(" ");
                product = words[words.length - 1].replace("?", "");
                if (!product.isEmpty()) {
                    product = product.substring(0, 1).toUpperCase() + product.substring(1);
                } else {
                    product = "Laptop";
                }
            }
        }

        try {
            return executeQuery(type, product, category);
        } catch (Exception e) {
            return "Sorry, I couldn't execute your query. Error: " + e.getMessage();
        }
    }

    private String callGoogleAI(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        requestBody.put("contents", new Object[]{Map.of("parts", new Object[]{part})});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getBody() != null) {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        }
        return "{}";
    }




    private String executeQuery(String type, String product, String category) {
        switch (type) {
            case "count_product":
                if (product != null) {
                    List<Product> products = productService.searchProducts(product);
                    int total = products.stream().mapToInt(Product::getQuantity).sum();
                    return "Total " + product + " in stock: " + total;
                }
                break;
            case "total_value_category":
                if (category != null) {
                    double totalValue = productService.getAllProducts().stream()
                            .filter(p -> p.getCategory() != null && p.getCategory().getName().equalsIgnoreCase(category))
                            .mapToDouble(p -> p.getPrice() * p.getQuantity())
                            .sum();
                    return "Total value of " + category + ": $" + totalValue;
                }
                break;
            case "low_stock":
                List<Product> lowStock = productService.getAllProducts().stream()
                        .filter(p -> p.getQuantity() < 10) // threshold
                        .toList();
                if (lowStock.isEmpty()) {
                    return "No products are low in stock.";
                }
                StringBuilder sb = new StringBuilder("Low stock products:\n");
                for (Product p : lowStock) {
                    sb.append(p.getName()).append(": ").append(p.getQuantity()).append("\n");
                }
                return sb.toString();
            default:
                return "I can help with queries like: 'How many laptops are in stock?', 'Total value of electronics?', 'List low stock products.'";
        }
        return "Query not understood.";
    }
}