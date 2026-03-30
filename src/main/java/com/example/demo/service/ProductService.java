package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private CategoryService categoryService;

    public Product saveProduct(ProductDTO productDTO, Long userId) {
        Category category = categoryService.getCategoryByIdAndUserId(productDTO.getCategoryId(), userId);
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setCategory(category);
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());
        
        User user = new User();
        user.setId(userId);
        product.setUser(user);

        return repository.save(product);
    }

    public List<Product> getAllProducts(Long userId) {
        return repository.findByUserId(userId);
    }

    public Product getProductByIdAndUserId(Long id, Long userId) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        if (product.getUser() == null || !product.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to product");
        }
        return product;
    }

    public Product updateProduct(Long id, ProductDTO productDTO, Long userId) {
        Product product = getProductByIdAndUserId(id, userId);
        Category category = categoryService.getCategoryByIdAndUserId(productDTO.getCategoryId(), userId);

        product.setName(productDTO.getName());
        product.setCategory(category);
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());

        return repository.save(product);
    }

    public List<Product> searchProducts(String name, Long userId) {
        return repository.findByUserIdAndNameContainingIgnoreCase(userId, name);
    }

    public void deleteProduct(Long id, Long userId) {
        Product product = getProductByIdAndUserId(id, userId);
        repository.delete(product);
    }

    public double calculateInventoryValue(Long userId) {
        double totalValue = 0;
        List<Product> products = repository.findByUserId(userId);

        for (Product p : products) {
            totalValue += p.getPrice() * p.getQuantity();
        }

        return totalValue;
    }
}